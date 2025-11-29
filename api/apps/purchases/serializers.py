from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import PurchaseRequest, RequestItem, ApprovalStep, FinanceNote, ApprovalPolicy
from apps.purchases.constants import PurchaseStatus, ApprovalStatus



# approval steps
class ApprovalStepSerializer(serializers.ModelSerializer):
    approver_name = serializers.CharField(source="approver.get_full_name", read_only=True)

    class Meta:
        model = ApprovalStep
        fields = ["id", "approver", "approver_name", "level", "status", "comments", "created_at"]



# finance notes
class FinanceNoteSerializer(serializers.ModelSerializer):
    finance_user_name = serializers.CharField(source="finance_user.get_full_name", read_only=True)

    class Meta:
        model = FinanceNote
        fields = ["id", "finance_user", "finance_user_name", "note", "created_at"]



# request items
class RequestItemSerializer(serializers.ModelSerializer):
    # total_price = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True, source="total_price")
     
    class Meta:
        model = RequestItem
        fields = ["id", "item_name", "qty", "price"]



# staff creating/updating requests
class PurchaseRequestCreateSerializer(serializers.ModelSerializer):
    items = RequestItemSerializer(many=True)

    class Meta:
        model = PurchaseRequest
        fields = ["id", "title", "description", "amount", "proforma_invoice", "items",]

    def create(self, validated_data):
        items_data = validated_data.pop("items")
        user = self.context["request"].user
        request_obj = PurchaseRequest.objects.create(created_by=user, **validated_data)
        for item_data in items_data:
            RequestItem.objects.create(purchase_request=request_obj, **item_data)
        return request_obj

    def update(self, instance, validated_data):
        items_data = validated_data.pop("items", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if items_data is not None:
            # Replace existing items
            instance.items.all().delete()
            for item_data in items_data:
                RequestItem.objects.create(purchase_request=instance, **item_data)

        return instance
    


# read-only views with all details
class PurchaseRequestSerializer(serializers.ModelSerializer):
    items = RequestItemSerializer(many=True, read_only=True)
    approval_steps = ApprovalStepSerializer(many=True, read_only=True)
    finance_notes = FinanceNoteSerializer(many=True, read_only=True)
    created_by_name = serializers.CharField(source="created_by.get_full_name", read_only=True)

    class Meta:
        model = PurchaseRequest
        fields = [
            "id",
            "title",
            "description",
            "amount",
            "status",
            "required_approval_levels",
            "proforma_invoice",
            "purchase_order",
            "receipt",
            "created_at",
            "updated_at",
            "created_by_name",
            "items",
            "approval_steps",
            "finance_notes",
        ]
        read_only_fields = fields



# finance updating purchase requests by uploading files
class FinanceUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseRequest
        fields = ["purchase_order", "receipt"]

    def update(self, instance, validated_data):
        for field in ["purchase_order", "receipt"]:
            if field in validated_data:
                setattr(instance, field, validated_data[field])
        instance.save()
        return instance
    
    
    
    
    class ApprovalPolicySerializer(serializers.ModelSerializer):
        class Meta:
            model = ApprovalPolicy
            fields = ["id", "title", "min_amount", "max_amount", "required_approval_levels", "active", "created_at",]
            read_only_fields = ["id", "created_at"]

        def validate(self, data):
            min_amount = data.get("min_amount")
            max_amount = data.get("max_amount")

            if min_amount is not None and max_amount is not None:
                if min_amount > max_amount:
                    raise serializers.ValidationError({
                        "min_amount": "Minimum amount cannot be greater than maximum amount."
                    })

            if data.get("required_approval_levels", 0) < 1:
                raise serializers.ValidationError({
                    "required_approval_levels": "Approval levels must be greater than zero."
                })

            return data