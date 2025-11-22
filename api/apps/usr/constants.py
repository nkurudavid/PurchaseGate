from django.db import models


class UserRole(models.TextChoices):
    STAFF = "staff", "Staff"
    APPROVER_LEVEL_1 = "approver_level_1", "Approver Level 1"
    APPROVER_LEVEL_2 = "approver_level_2", "Approver Level 2"
    APPROVER_LEVEL_3 = "approver_level_3", "Approver Level 3"
    FINANCE = "finance", "Finance Team"
    ADMIN = "admin", "Admin"

ROLE_CHOICES = UserRole.choices




class UserGender(models.TextChoices):
    MALE = "male", "Male"
    FEMALE = "female", "Female"
    OTHER = "other", "Other"
    PREFER_NOT_TO_SAY = "prefer_not_to_say", "Prefer not to say"

GENDER_CHOICES = UserGender.choices
    