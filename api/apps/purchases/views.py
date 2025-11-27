import uuid
from rest_framework import viewsets, mixins, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ParseError

from apps.usr.constants import UserRole
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



class PurchaseRequestViewSet(viewsets.GenericViewSet,
                             mixins.CreateModelMixin,
                             mixins.UpdateModelMixin,
                             mixins.DestroyModelMixin,
                             mixins.ListModelMixin,
                             mixins.RetrieveModelMixin):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        role = getattr(user, "role", None)

        if role == UserRole.STAFF:
            return PurchaseRequest.objects.filter(created_by=user)
        elif role == UserRole.APPROVER:
            return PurchaseRequest.objects.all()
        elif role == UserRole.FINANCE:
            return PurchaseRequest.objects.filter(status=ApprovalStatus.APPROVED)
        return PurchaseRequest.objects.none()

    def get_serializer_class(self):
        user = self.request.user
        role = getattr(user, "role", None)

        if role == UserRole.STAFF:
            if self.action in ["create", "update", "partial_update"]:
                return PurchaseRequestCreateSerializer
            return PurchaseRequestSerializer

        elif role == UserRole.FINANCE:
            if self.action in ["update", "partial_update"]:
                return FinanceUpdateSerializer
            return PurchaseRequestSerializer

        elif role == UserRole.APPROVER:
            return PurchaseRequestSerializer

        return PurchaseRequestSerializer

    def get_permissions(self):
        role_permission_map = {
            UserRole.STAFF: [IsStaffOfficer],
            UserRole.APPROVER: [IsApprover],
            UserRole.FINANCE: [IsFinanceOfficer],
        }
        user_role = getattr(self.request.user, "role", None)
        self.permission_classes = [IsAuthenticated] + role_permission_map.get(user_role, [])
        return super().get_permissions()

    # ----------------- APPROVER ACTIONS -----------------
    @action(detail=True, methods=["patch"], permission_classes=[IsAuthenticated, IsApprover])
    def approve(self, request, pk=None):
        purchase_request = self.get_object()

        # Determine next approval level
        last_step = purchase_request.approval_steps.order_by("-level").first()
        next_level = (last_step.level + 1) if last_step else 1

        # Prevent exceeding required approval levels
        if next_level > purchase_request.required_approval_levels:
            return Response(
                {"error": "Maximum approval levels already reached."},
                status=status.HTTP_400_BAD_REQUEST
            )

        ApprovalStep.objects.create(
            purchase_request=purchase_request,
            approver=request.user,
            status=ApprovalStatus.APPROVED,
            comments=request.data.get("comments", ""),
            level=next_level
        )

        return Response({"message": "Request approved"}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["patch"], permission_classes=[IsAuthenticated, IsApprover])
    def reject(self, request, pk=None):
        purchase_request = self.get_object()

        last_step = purchase_request.approval_steps.order_by("-level").first()
        next_level = (last_step.level + 1) if last_step else 1

        ApprovalStep.objects.create(
            purchase_request=purchase_request,
            approver=request.user,
            status=ApprovalStatus.REJECTED,
            comments=request.data.get("comments", ""),
            level=next_level
        )

        return Response({"message": "Request rejected"}, status=status.HTTP_200_OK)




class FinanceNoteViewSet(viewsets.GenericViewSet,
                         mixins.CreateModelMixin,
                         mixins.UpdateModelMixin,
                         mixins.DestroyModelMixin):

    permission_classes = [IsAuthenticated, IsFinanceOfficer]
    serializer_class = FinanceNoteSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        request_id = self.kwargs.get('request_pk')

        if request_id:
            queryset = queryset.filter(purchase_request_id=request_id)

        return queryset

    def perform_create(self, serializer):
        request_id = self.kwargs.get("request_pk")

        if not request_id:
            raise ParseError("Missing purchase request ID.")

        serializer.save(
            purchase_request_id=request_id,
            finance_user=self.request.user
        )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        headers = self.get_success_headers(serializer.data)
        return Response({
            'message': 'Finance note added successfully!',
            'data': serializer.data
        }, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response({
            'message': 'Finance note updated successfully!',
            'data': serializer.data
        }, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)

        return Response({
            'message': 'Finance note deleted successfully!'
        }, status=status.HTTP_204_NO_CONTENT)
