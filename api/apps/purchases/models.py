from decimal import Decimal
from django.db import models
from django.db.models import Max
from django.core.validators import MinValueValidator
from django.contrib.auth import get_user_model
from django.utils.safestring import mark_safe
from django.core.validators import FileExtensionValidator
from django.core.exceptions import ValidationError
from apps.purchases.constants import PurchaseStatus, ApprovalStatus




class ApprovalPolicy(models.Model):
    title = models.CharField(max_length=255, verbose_name="Policy Title")
    min_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name="Minimum Amount", validators=[MinValueValidator(0)])
    max_amount = models.DecimalField(max_digits=12, decimal_places=2, default=999999999, verbose_name="Maximum Amount", validators=[MinValueValidator(0)])
    required_approval_levels = models.PositiveIntegerField(default=2, verbose_name="Approval Levels")
    active = models.BooleanField(default=True, verbose_name="Active Policy")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["min_amount"]
        
    def matches(self, amount):
        if not self.active:
            return False
        min_amount = self.min_amount if self.min_amount is not None else Decimal('0')
        max_amount = self.max_amount if self.max_amount is not None else Decimal('999999999')

        return min_amount <= amount <= max_amount
    
    def __str__(self):
        return f"{self.title} ({self.min_amount} - {self.max_amount} => {self.required_approval_levels} levels)"



class PurchaseRequest(models.Model):
    created_by = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name="purchase_requests", verbose_name="Requested By")
    title = models.CharField(max_length=255, verbose_name="Purchase Title")
    description = models.TextField(verbose_name="Description...", blank=True, null=True)
    amount = models.DecimalField(verbose_name="Amount", max_digits=12, decimal_places=2, default=0, editable=False)
    status = models.CharField(verbose_name="Request Status", max_length=20, choices=PurchaseStatus.choices, default=PurchaseStatus.PENDING)
    required_approval_levels = models.PositiveIntegerField(default=2, verbose_name="Required Approval Levels")
    proforma_invoice = models.FileField(verbose_name="Proforma Invoice File", upload_to="proforma/", validators=[FileExtensionValidator(['png','jpg','jpeg', 'pdf', 'ppt', 'docx', 'xlsx'])], null=True, blank=True)
    purchase_order = models.FileField(verbose_name="Purchase Order", upload_to="purchase_orders/", validators=[FileExtensionValidator(['png','jpg','jpeg', 'pdf', 'ppt', 'docx', 'xlsx'])], null=True, blank=True)
    receipt = models.FileField(verbose_name="Receipt File", upload_to="receipts/", validators=[FileExtensionValidator(['png','jpg','jpeg', 'pdf', 'ppt', 'docx', 'xlsx'])], null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - {self.status}"
    
    @property
    def total_amount(self):
        return sum(item.total_price for item in self.items.all())
    
    def apply_policy(self):
        total = self.amount
        if total is None or total == 0:
            return

        for policy in ApprovalPolicy.objects.filter(active=True).order_by("min_amount"):
            if policy.matches(total):
                self.required_approval_levels = policy.required_approval_levels
                print(f"Policy applied: {policy.title} -> {self.required_approval_levels}")
                return

    def clean(self):
        self.apply_policy()

        if self.pk:
            old = PurchaseRequest.objects.get(pk=self.pk)
            if old.status == PurchaseStatus.REJECTED:
                raise ValidationError("Rejected requests cannot be changed.")

            if old.status == PurchaseStatus.APPROVED:
                protected = ["title", "description", "amount", "required_approval_levels"]
                for f in protected:
                    if getattr(old, f) != getattr(self, f):
                        raise ValidationError(f"'{f}' cannot be changed after approval.")


class RequestItem(models.Model):
    purchase_request = models.ForeignKey(PurchaseRequest, on_delete=models.CASCADE, related_name="items", verbose_name="Purchase Request")
    item_name = models.CharField(max_length=255, verbose_name="Item Name")
    qty = models.PositiveIntegerField(default=1, verbose_name="Quantity")
    price = models.DecimalField(max_digits=12, decimal_places=2, verbose_name="Unit Price")

    @property
    def total_price(self):
        return self.qty * self.price
    
    def clean(self):
        if self.purchase_request.status in ["APPROVED", "REJECTED"]:
            raise ValidationError("Cannot edit items after final review.")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

        pr = self.purchase_request
        pr.amount = pr.total_amount
        pr.apply_policy()
        pr.save(update_fields=['amount', 'required_approval_levels'])

    def __str__(self):
        return f"{self.item_name} x {self.qty}"



class ApprovalStep(models.Model):
    purchase_request = models.ForeignKey(PurchaseRequest, on_delete=models.CASCADE, related_name="approval_steps", verbose_name="Purchase Request")
    approver = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name="approved_requests", verbose_name="Approver")
    level = models.PositiveIntegerField(verbose_name="Approvel Level", blank=True, null=True)  # 1, 2, 3…
    status = models.CharField(max_length=20, choices=ApprovalStatus.choices, verbose_name="Approval Status")
    comments = models.TextField(null=True, blank=True, verbose_name="Comments")
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ("purchase_request", "level") 
    
    def update_amount(self):
        total = sum(item.total_price for item in self.items.all())
        self.amount = total
    
    def clean(self):
        if not self.pk:
            return
        old = ApprovalStep.objects.get(pk=self.pk)
        if old.status in [ApprovalStatus.APPROVED, ApprovalStatus.REJECTED]:
            raise ValidationError("Final approval cannot be changed.")
        
        # Prevent exceeding required levels
        if self.level and self.purchase_request.required_approval_levels:
            if self.level > self.purchase_request.required_approval_levels:
                raise ValidationError(
                    f"Level cannot exceed required approval levels ({self.purchase_request.required_approval_levels})."
                )

    def save(self, *args, **kwargs):
        # Automatically assign level if not set
        if not self.level:
            max_level = (
                ApprovalStep.objects.filter(purchase_request=self.purchase_request)
                .aggregate(Max("level"))["level__max"] or 0
            )
            next_level = max_level + 1

            if next_level > self.purchase_request.required_approval_levels:
                raise ValidationError(
                    f"Cannot create more than {self.purchase_request.required_approval_levels} approval steps."
                )
            self.level = next_level
            
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Level {self.level} - {self.status}"



class FinanceNote(models.Model):
    purchase_request = models.OneToOneField( PurchaseRequest, on_delete=models.CASCADE, related_name="finance_notes", verbose_name="Purchase Request")
    finance_user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name="finance_notes_created", verbose_name="Finance Officer")
    note = models.TextField(verbose_name="Finance Note", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Finance Note - {self.purchase_request.id}"
