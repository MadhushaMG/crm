from rest_framework import viewsets, permissions, serializers
from .models import Company, Contact, ActivityLog
from .serializers import CompanySerializer, ContactSerializer, ActivityLogSerializer

# --- CUSTOM PERMISSION FOR ROLE-BASED ACCESS CONTROL (RBAC) ---
class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission to:
    - Only ADMIN can DELETE.
    - ADMIN and MANAGER can EDIT (PUT/PATCH).
    - STAFF and others can only VIEW or CREATE.
    """
    def has_permission(self, request, view):
        # Allow anyone authenticated to VIEW (GET, HEAD, OPTIONS)
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Allow anyone authenticated to CREATE (POST)
        if request.method == 'POST':
            return request.user.is_authenticated

        # Allow ADMIN and MANAGER to EDIT
        if request.method in ['PUT', 'PATCH']:
            return request.user.role in ['ADMIN', 'MANAGER']

        # Only ADMIN can DELETE
        if request.method == 'DELETE':
            return request.user.role == 'ADMIN'

        return False

# --- VIEWSETS ---

class CompanyViewSet(viewsets.ModelViewSet):
    serializer_class = CompanySerializer
    # JWT Auth + Custom Role-based permission
    permission_classes = [permissions.IsAuthenticated, IsAdminOrReadOnly]

    def get_queryset(self):
        # Filter data by current user's organization only
        return Company.objects.filter(
            organization=self.request.user.organization, 
            is_deleted=False
        ).order_by('-created_at')

    def perform_create(self, serializer):
        if not self.request.user.organization:
            raise serializers.ValidationError({"error": "User has no organization assigned. Check Admin panel."})
        serializer.save(organization=self.request.user.organization)

class ContactViewSet(viewsets.ModelViewSet):
    serializer_class = ContactSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrReadOnly]

    def get_queryset(self):
        return Contact.objects.filter(
            organization=self.request.user.organization, 
            is_deleted=False
        ).order_by('-created_at')

    def perform_create(self, serializer):
        if not self.request.user.organization:
            raise serializers.ValidationError({"error": "User has no organization assigned."})
        serializer.save(organization=self.request.user.organization)

class ActivityLogViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ActivityLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Show activity logs specific to the user's organization
        return ActivityLog.objects.filter(
            organization=self.request.user.organization
        ).order_by('-timestamp')