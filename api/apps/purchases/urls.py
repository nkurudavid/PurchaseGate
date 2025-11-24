from django.urls import include, path
from apps.purchases import views
from rest_framework.routers import DefaultRouter
from apps.purchases.views import (
    StaffPurchaseRequestViewSet, 
    ApproverPurchaseRequestViewSet, 
    FinancePurchaseRequestViewSet, 
    ApprovalStepViewSet, 
    FinanceNoteViewSet
)

router = DefaultRouter()
router.register("staff/requests", StaffPurchaseRequestViewSet, basename="staff-requests")
router.register("approver/requests", ApproverPurchaseRequestViewSet, basename="approver-requests")
router.register("finance/requests", FinancePurchaseRequestViewSet, basename="finance-requests")
router.register("approval_steps", ApprovalStepViewSet, basename="approval-steps")
router.register("finance_notes", FinanceNoteViewSet, basename="finance-notes")


urlpatterns = [
    path("", include(router.urls)),
]