import uuid
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from apps.usr.permissions import IsApprover, IsFinanceOfficer, IsStaffOfficer, IsNotAdmin
from apps.purchases.models import PurchaseRequest, ApprovalStep, FinanceNote
from apps.purchases.constants import PurchaseStatus, ApprovalStatus
from apps.purchases.serializers import (
    ApprovalStepSerializer,
    FinanceNoteSerializer,
    PurchaseRequestCreateSerializer,
    PurchaseRequestSerializer,
    FinanceUpdateSerializer
)



class StaffPurchaseRequestViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsStaffOfficer]
    serializer_class = PurchaseRequestSerializer
    def get_queryset(self):
        return PurchaseRequest.objects.filter(created_by=self.request.user)

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return PurchaseRequestCreateSerializer
        return PurchaseRequestSerializer




class ApproverPurchaseRequestViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated, IsApprover]
    serializer_class = PurchaseRequestSerializer
    
    def get_queryset(self):
        return PurchaseRequest.objects.all()
        # Filter purchase requests where the user is assigned as approver
        # user = self.request.user
        # return PurchaseRequest.objects.filter(approval_steps__approver=user).distinct()




class FinancePurchaseRequestViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsFinanceOfficer]
    serializer_class = PurchaseRequestSerializer

    def get_queryset(self):
        return PurchaseRequest.objects.filter(status=ApprovalStatus.APPROVED)

    def get_serializer_class(self):
        if self.action in ["update", "partial_update"]:
            return FinanceUpdateSerializer
        return PurchaseRequestSerializer




class ApprovalStepViewSet(viewsets.GenericViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ApprovalStepSerializer
    queryset = ApprovalStep.objects.none()

    # def create(self, request, *args, **kwargs):
    #     serializer = self.get_serializer(data=request.data)
    #     serializer.is_valid(raise_exception=True)
    #     serializer.save()
    #     return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    # --- APPROVE STEP ---
    @action(detail=True, methods=["post"])
    def approve(self, request, pk=None):
        step = self.get_object()
        step.status = "APPROVED"
        step.comments = request.data.get("comments", "")
        step.approver = request.user
        step.save()  # <-- SIGNAL will update PurchaseRequest
        return Response({"message": "Step approved"}, status=status.HTTP_200_OK)

    # --- REJECT STEP ---
    @action(detail=True, methods=["post"])
    def reject(self, request, pk=None):
        step = self.get_object()
        step.status = "REJECTED"
        step.comments = request.data.get("comments", "")
        step.approver = request.user
        step.save()  # <-- SIGNAL will update PurchaseRequest immediately
        return Response({"message": "Step rejected"}, status=status.HTTP_200_OK)


    # block all other methods
    def list(self, request, *args, **kwargs):
        return Response({"detail": "Not allowed."}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def retrieve(self, request, *args, **kwargs):
        return Response({"detail": "Not allowed."}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def update(self, request, *args, **kwargs):
        return Response({"detail": "Not allowed."}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def destroy(self, request, *args, **kwargs):
        return Response({"detail": "Not allowed."}, status=status.HTTP_405_METHOD_NOT_ALLOWED)




class FinanceNoteViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsFinanceOfficer]
    serializer_class = FinanceNoteSerializer
    queryset = FinanceNote.objects.none()

    # block list + retrieve (write-only)
    def list(self, request, *args, **kwargs):
        return Response({"detail": "Not allowed."}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def retrieve(self, request, *args, **kwargs):
        return Response({"detail": "Not allowed."}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
