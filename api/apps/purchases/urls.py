from django.urls import include, path
from apps.purchases import views
from rest_framework_nested import routers
from apps.purchases.views import (
    PurchaseRequestViewSet,
    FinanceNoteViewSet,
    ApprovalPolicyViewSet
)

router = routers.SimpleRouter()
router.register("requests", PurchaseRequestViewSet, basename="requests")
router.register("approval_policies", ApprovalPolicyViewSet, basename="approvalpolicy")

# Nested router under "requests/<id>/"
requests_router = routers.NestedSimpleRouter(router, "requests", lookup="request")
requests_router.register("finance_notes", FinanceNoteViewSet, basename="finance-notes")


urlpatterns = [
    path("", include(router.urls)),
    path("", include(requests_router.urls)),
]