from django.db import models



class PurchaseStatus(models.TextChoices):
    PENDING = "PENDING", "Pending"
    APPROVED = "APPROVED", "Approved"
    REJECTED = "REJECTED", "Rejected"
    

class ApprovalStatus(models.TextChoices):
    APPROVED = "APPROVED", "Approved"
    REJECTED = "REJECTED", "Rejected"




PURCHASE_STATUS_CHOICES = PurchaseStatus.choices
APPROVAL_CHOICES = PurchaseStatus.choices