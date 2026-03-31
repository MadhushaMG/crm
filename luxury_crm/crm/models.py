from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

class Organization(models.Model):
    PLAN_CHOICES = [('Basic', 'Basic'), ('Pro', 'Pro')]
    name = models.CharField(max_length=255)
    subscription_plan = models.CharField(max_length=10, choices=PLAN_CHOICES, default='Basic')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class User(AbstractUser):
    ROLE_CHOICES = [
        ('ADMIN', 'Admin'),
        ('MANAGER', 'Manager'),
        ('STAFF', 'Staff'),
    ]
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='users', null=True, blank=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='STAFF')

class Company(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    industry = models.CharField(max_length=100)
    logo = models.ImageField(upload_to='logos/', null=True, blank=True) 
    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Contact(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='contacts')
    full_name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=15, blank=True)
    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('company', 'email')

class ActivityLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    action_type = models.CharField(max_length=10) # CREATE, UPDATE, DELETE
    model_name = models.CharField(max_length=50)
    object_id = models.CharField(max_length=50) # Changed to CharField to avoid issues with different IDs
    timestamp = models.DateTimeField(auto_now_add=True)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)

# --- SIGNALS FOR AUTO LOGGING ---
@receiver(post_save, sender=Company)
@receiver(post_save, sender=Contact)
def log_save(sender, instance, created, **kwargs):
    action = "CREATE" if created else "UPDATE"
    ActivityLog.objects.create(
        organization=instance.organization,
        action_type=action,
        model_name=sender.__name__,
        object_id=str(instance.id)
    )

@receiver(post_delete, sender=Company)
@receiver(post_delete, sender=Contact)
def log_delete(sender, instance, **kwargs):
    ActivityLog.objects.create(
        organization=instance.organization,
        action_type="DELETE",
        model_name=sender.__name__,
        object_id=str(instance.id)
    )