from rest_framework import permissions

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        # All Staff/Manager/Admin can view (GET) ප
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Add data in all user (POST) 
        if request.method == 'POST':
            return request.user.is_authenticated

        # Edit (PUT/PATCH)  ADMIN  MANAGER 
        if request.method in ['PUT', 'PATCH']:
            return request.user.role in ['ADMIN', 'MANAGER']

        # Delete data only ADMIN
        if request.method == 'DELETE':
            return request.user.role == 'ADMIN'

        return False