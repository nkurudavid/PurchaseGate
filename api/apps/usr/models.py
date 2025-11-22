from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from apps.usr.user_manager import UserManager


class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = [
        ("staff", "Staff"),
        ("approver_level_1", "Approver Level 1"),
        ("approver_level_2", "Approver Level 2"),
        ("finance", "Finance Team"),
        ("admin", "Admin"),
    ]

    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255)

    role = models.CharField(
        max_length=30,
        choices=ROLE_CHOICES,
        default="staff"
    )

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["full_name"]

    def __str__(self):
        return f"{self.full_name} ({self.role})"
