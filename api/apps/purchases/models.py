from django.db import models
from django.contrib.auth import get_user_model
from django.utils.safestring import mark_safe
from django.core.validators import FileExtensionValidator
from apps.purchases.constants import PurchaseStatus, ApprovalStatus



class PurchaseRequest(models.Model):
    created_by = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name="purchase_requests", verbose_name="Requested By")
    title = models.CharField(max_length=255, verbose_name="Purchase Title")
    description = models.TextField(verbose_name="Description...", blank=True, null=True)
    amount = models.DecimalField(verbose_name="Amount", max_digits=12, decimal_places=2)
    status = models.CharField(verbose_name="Request Status", max_length=20, choices=PurchaseStatus.choices, default=PurchaseStatus.PENDING)
    proforma_invoice = models.FileField(verbose_name="Proforma Invoice File", upload_to="proforma/", validators=[FileExtensionValidator(['png','jpg','jpeg', 'pdf', 'ppt', 'docx', 'xlsx'])], null=True, blank=True)
    purchase_order = models.FileField(verbose_name="Purchase Order", upload_to="purchase_orders/", validators=[FileExtensionValidator(['png','jpg','jpeg', 'pdf', 'ppt', 'docx', 'xlsx'])], null=True, blank=True)
    receipt = models.FileField(verbose_name="Receipt File", upload_to="receipts/", validators=[FileExtensionValidator(['png','jpg','jpeg', 'pdf', 'ppt', 'docx', 'xlsx'])], null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - {self.status}"



class RequestItem(models.Model):
    purchase_request = models.ForeignKey(PurchaseRequest, on_delete=models.CASCADE, related_name="items", verbose_name="Purchase Request")
    item_name = models.CharField(max_length=255, verbose_name="Item Name")
    qty = models.PositiveIntegerField(default=1, verbose_name="Quantity")
    price = models.DecimalField(max_digits=12, decimal_places=2, verbose_name="Unit Price")

    @property
    def total_price(self):
        return self.qty * self.price

    def __str__(self):
        return f"{self.item_name} x {self.qty}"



class ApprovalStep(models.Model):
    purchase_request = models.ForeignKey(PurchaseRequest, on_delete=models.CASCADE, related_name="approval_steps", verbose_name="Purchase Request")
    approver = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name="approved_requests", verbose_name="Approver")
    level = models.PositiveIntegerField(verbose_name="Approvel Level")  # 1, 2, 3…
    status = models.CharField(max_length=20, choices=ApprovalStatus.choices, verbose_name="Approval Status")
    comments = models.TextField(null=True, blank=True, verbose_name="Comments")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Level {self.level} - {self.status}"



class FinanceNote(models.Model):
    purchase_request = models.ForeignKey( PurchaseRequest, on_delete=models.CASCADE, related_name="finance_notes", verbose_name="Purchase Request")
    finance_user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name="finance_notes_created", verbose_name="Finance Officer")
    note = models.TextField(verbose_name="Finance Note", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Finance Note - {self.purchase_request.id}"
