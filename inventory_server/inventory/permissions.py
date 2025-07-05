from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user and getattr(request.user, 'role', None) == 'admin'

class IsStaff(BasePermission):
    def has_permission(self, request, view):
        return request.user and getattr(request.user, 'role', None) in ['staff', 'admin']
