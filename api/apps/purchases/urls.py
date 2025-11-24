from django.urls import include, path
from apps.purchases import views
from rest_framework.routers import DefaultRouter
from apps.purchases.views import (
    PurchaseRequestViewSet,
    ApprovalStepViewSet, 
    FinanceNoteViewSet
)

router = DefaultRouter()
router.register("requests", PurchaseRequestViewSet, basename="requests")
router.register("approval_steps", ApprovalStepViewSet, basename="approval-steps")
router.register("finance_notes", FinanceNoteViewSet, basename="finance-notes")


urlpatterns = [
    path("", include(router.urls)),
]