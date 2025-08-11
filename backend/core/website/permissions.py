from rest_framework.permissions import BasePermission


class AdminOnly(BasePermission):
    def has_permission(self, request, view):
        return request.method == "GET" or (not request.user.which_type)