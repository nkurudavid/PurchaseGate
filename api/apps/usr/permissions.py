from rest_framework.permissions import BasePermission
from api.apps.usr.constants import UserRole



class IsStaffOfficer(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == UserRole.STAFF

class IsApprover(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == UserRole.APPROVER

class IsFinanceOfficer(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == UserRole.FINANCE
