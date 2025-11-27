from django.contrib import admin
from django.utils.html import format_html
from .models import (
    ApprovalPolicy, PurchaseRequest, RequestItem, ApprovalStep, FinanceNote
)


class RequestItemInline(admin.TabularInline):
    model = RequestItem
    extra = 1

class ApprovalStepInline(admin.TabularInline):
    model = ApprovalStep
    extra = 1
    readonly_fields = ["level", "created_at"]


@admin.register(ApprovalPolicy)
class ApprovalPolicyAdmin(admin.ModelAdmin):
    list_display = ["title", "min_amount", "max_amount", "required_approval_levels", "active", "created_at"]
    list_filter = ["active"]
    search_fields = ["title"]


@admin.register(PurchaseRequest)
class PurchaseRequestAdmin(admin.ModelAdmin):
    list_display = ("title", "created_by", "amount", "status", "required_approval_levels", "created_at")
    search_fields = ("title", "created_by__first_name", "created_by__last_name", "created_by__email")
    list_filter = ("status",)
    ordering = ("-created_at",)
    readonly_fields = ("amount", "required_approval_levels", "status", "created_at", "updated_at",)
    exclude = ["required_approval_levels"]
    inlines = [RequestItemInline]


@admin.register(RequestItem)
class RequestItemAdmin(admin.ModelAdmin):
    list_display = ("item_name", "qty", "price", "total_price", "purchase_request")
    search_fields = ("item_name", "purchase_request__title")
    ordering = ("purchase_request",)


@admin.register(ApprovalStep)
class ApprovalStepAdmin(admin.ModelAdmin):
    list_display = ("purchase_request", "level", "approver", "status", "created_at")
    search_fields = ("purchase_request__title", "approver__first_name", "approver__last_name", "approver__email",)
    list_filter = ("status", "level",)
    ordering = ("purchase_request", "level")
    readonly_fields = ["level", "created_at"]


@admin.register(FinanceNote)
class FinanceNoteAdmin(admin.ModelAdmin):
    list_display = ("purchase_request", "finance_user", "created_at")
    search_fields = ("finance_user__first_name", "finance_user__last_name", "finance_user__email", "purchase_request__title")
    ordering = ("-created_at",)
    readonly_fields = ("created_at",)
