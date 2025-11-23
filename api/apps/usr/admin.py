from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _
from apps.usr.models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    """Professional admin panel for custom User model."""

    # Fields to show in list view
    list_display = (
        "id",
        "first_name",
        "last_name",
        "email",
        "role",
        "gender",
        "is_active",
        "is_staff",
        "created_at",
    )
    list_display_links = ("id", "email")
    list_filter = ("role", "gender", "is_active", "is_staff", "created_at")

    # Search by name or email
    search_fields = ("email", "first_name", "last_name")

    # Order by newest users first
    ordering = ("-created_at",)

    readonly_fields = ("created_at",)

    # Remove username since your model removed it
    fieldsets = (
        (_("Login Credentials"), {
            "fields": ("email", "password")
        }),
        (_("Personal Info"), {
            "fields": ("first_name", "last_name", "gender")
        }),
        (_("Role & Permissions"), {
            "fields": ("role", "is_active", "is_staff", "is_superuser", "groups", "user_permissions")
        }),
        (_("Important Dates"), {
            "fields": ("last_login", "created_at")
        }),
    )

    # For creating new users in admin
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "first_name", "last_name", "gender", "role", "password1", "password2"),
        }),
    )
