from django.contrib import admin
from django.utils.html import format_html
from .models import (
    PurchaseRequest, RequestItem, ApprovalStep, FinanceNote
)


@admin.register(PurchaseRequest)
class PurchaseRequestAdmin(admin.ModelAdmin):
    list_display = ("title", "created_by", "amount", "status", "required_approval_levels", "created_at")
    search_fields = ("title", "created_by__first_name", "created_by__last_name", "created_by__email")
    list_filter = ("status")


@admin.register(RequestItem)
class RequestItemAdmin(admin.ModelAdmin):
    list_display = ("item_name", "qty", "price", "total_price", "purchase_request")
    search_fields = ("item_name", "purchase_request__title")


@admin.register(ApprovalStep)
class ApprovalStepAdmin(admin.ModelAdmin):
    list_display = ("purchase_request", "level", "approver", "status", "created_at")
    list_filter = ("status", "level")


@admin.register(FinanceNote)
class FinanceNoteAdmin(admin.ModelAdmin):
    list_display = ("purchase_request", "finance_user", "created_at")
    search_fields = ("finance_user__first_name", "finance_user__last_name", "finance_user__email", "purchase_request__title")
