from rest_framework import serializers

from .models import Resume

class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = '__all__'
        
        
        extra_kwargs = {
            'name': {'required': False, 'allow_blank': True},
            'email': {'required': False, 'allow_blank': True},
            'location': {'required': False, 'allow_blank': True},
            'college_name': {'required': False, 'allow_blank': True},
            'degree': {'required': False, 'allow_blank': True},
            'companies': {'required': False, 'allow_blank': True},
            'worked_as': {'required': False, 'allow_blank': True},
            'skills': {'required': False, 'allow_blank': True},
            'experience': {'required': False, 'allow_blank': True},
            'linkedin': {'required': False, 'allow_blank': True},
            'extracted_data': {'required': False, 'allow_blank': True}
        }
    
    def validate_skills(self, value):
        # Ensure skills are stored as a comma-separated string
        if isinstance(value, list):
            return ', '.join(value)
        return value

    def validate_extracted_data(self, value):
        # Ensure extracted data is stored as a string
        if isinstance(value, list):
            return str(value)
        return value