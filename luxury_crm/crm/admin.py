from django.contrib import admin
from .models import Organization, User, Company, Contact

admin.site.register(Organization)
admin.site.register(User)
admin.site.register(Company)
admin.site.register(Contact)