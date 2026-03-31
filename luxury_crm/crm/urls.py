from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CompanyViewSet, ContactViewSet, ActivityLogViewSet

router = DefaultRouter()
router.register(r'companies', CompanyViewSet, basename='company')
router.register(r'contacts', ContactViewSet, basename='contact')
router.register(r'activity-logs', ActivityLogViewSet, basename='activitylog')

urlpatterns = [
    path('', include(router.urls)),
]