from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.purchases.models import PurchaseRequest, ApprovalStep
from apps.purchases.constants import PurchaseStatus, ApprovalStatus


# SIGNAL: Update the PurchaseRequest status automatically
@receiver(post_save, sender=ApprovalStep)
def update_request_status(sender, instance, **kwargs):
    request = instance.purchase_request

    # If any step is rejected → request rejected immediately
    if request.approval_steps.filter(status=ApprovalStatus.REJECTED).exists():
        if request.status != PurchaseStatus.REJECTED:
            request.status = PurchaseStatus.REJECTED
            request.save(update_fields=['status'])
        return

    # Count approved steps
    approved_count = request.approval_steps.filter(status=ApprovalStatus.APPROVED).count()
    if approved_count >= request.required_approval_levels:
        if request.status != PurchaseStatus.APPROVED:
            request.status = PurchaseStatus.APPROVED
            request.save(update_fields=['status'])