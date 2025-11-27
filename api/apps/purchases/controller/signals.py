from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from apps.purchases.models import PurchaseRequest, ApprovalStep
from apps.purchases.constants import PurchaseStatus, ApprovalStatus


def recompute_request_status(request: PurchaseRequest):
    steps = request.approval_steps.all()

    # If no approvals exist → pending
    if not steps.exists():
        request.status = PurchaseStatus.PENDING
        request.save(update_fields=["status"])
        return

    # If ANY rejected → rejected
    if steps.filter(status=ApprovalStatus.REJECTED).exists():
        request.status = PurchaseStatus.REJECTED
        request.save(update_fields=["status"])
        return

    # Count approved
    approved_count = steps.filter(status=ApprovalStatus.APPROVED).count()

    # If completed → approved
    if approved_count >= request.required_approval_levels:
        request.status = PurchaseStatus.APPROVED
    else:
        request.status = PurchaseStatus.PENDING

    request.save(update_fields=["status"])


@receiver(post_save, sender=ApprovalStep)
def update_request_on_save(sender, instance, **kwargs):
    recompute_request_status(instance.purchase_request)


@receiver(post_delete, sender=ApprovalStep)
def update_request_on_delete(sender, instance, **kwargs):
    recompute_request_status(instance.purchase_request)
