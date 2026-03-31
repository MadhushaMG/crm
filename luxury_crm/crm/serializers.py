import re
from rest_framework import serializers
from .models import ActivityLog, Organization, User, Company, Contact

class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = '__all__'

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        
        fields = ['id', 'name', 'industry', 'logo', 'created_at', 'organization']
        read_only_fields = ['organization']

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ['id', 'company', 'full_name', 'email', 'phone', 'is_deleted', 'organization', 'created_at']
        read_only_fields = ['organization']

    # --- Phone Number Validation (8-15 digits) ---
    def validate_phone(self, value):
        if value:
     
            if not re.match(r'^\d{8,15}$', value):
                raise serializers.ValidationError("Phone number must be between 8 and 15 digits and contain only numbers.")
        return value

    # --- Multi-field Validation (Email uniqueness per company) ---
    def validate(self, data):
        company = data.get('company')
        email = data.get('email')

     
        queryset = Contact.objects.filter(company=company, email=email)
        if self.instance:
            queryset = queryset.exclude(id=self.instance.id)
        
        if queryset.exists():
            raise serializers.ValidationError({"email": "This email is already registered for this company."})
        
        return data

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'organization', 'role']

class ActivityLogSerializer(serializers.ModelSerializer):
   
    user_email = serializers.ReadOnlyField(source='user.email')

    class Meta:
        model = ActivityLog
        fields = ['id', 'user_email', 'action_type', 'model_name', 'object_id', 'timestamp']