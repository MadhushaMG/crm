from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Company, ActivityLog

@receiver(post_save, sender=Company)
def log_company_save(sender, instance, created, **kwargs):
    action = 'CREATE' if created else 'UPDATE'
    ActivityLog.objects.create(
        user=None, 
        action_type=action,
        model_name='Company',
        object_id=instance.id,
        organization=instance.organization
    )