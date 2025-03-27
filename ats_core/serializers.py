from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, Job, Resume, Application

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'role', 'company_name', 'phone_number', 'address', 'created_at', 'updated_at']

class JobSerializer(serializers.ModelSerializer):
    employer_name = serializers.SerializerMethodField()
    company_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Job
        fields = ['id', 'title', 'employer', 'employer_name', 'company_name', 'description', 
                  'requirements', 'location', 'salary_range', 'job_type', 'status', 
                  'posted_date', 'deadline', 'created_at', 'updated_at']
        read_only_fields = ['employer', 'employer_name', 'company_name']
    
    def get_employer_name(self, obj):
        return obj.employer.get_full_name() or obj.employer.username
    
    def get_company_name(self, obj):
        try:
            profile = UserProfile.objects.get(user=obj.employer)
            return profile.company_name
        except UserProfile.DoesNotExist:
            return None

class ResumeSerializer(serializers.ModelSerializer):
    candidate_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Resume
        fields = ['id', 'candidate', 'candidate_name', 'title', 'file', 'upload_date', 'is_active']
        read_only_fields = ['candidate', 'candidate_name']
    
    def get_candidate_name(self, obj):
        return obj.candidate.get_full_name() or obj.candidate.username

class ApplicationSerializer(serializers.ModelSerializer):
    job_title = serializers.SerializerMethodField()
    candidate_name = serializers.SerializerMethodField()
    resume_title = serializers.SerializerMethodField()
    
    class Meta:
        model = Application
        fields = ['id', 'job', 'job_title', 'candidate', 'candidate_name', 'resume', 
                  'resume_title', 'cover_letter', 'status', 'application_date', 
                  'last_updated', 'employer_notes']
        read_only_fields = ['candidate', 'candidate_name', 'job_title', 'resume_title']
    
    def get_job_title(self, obj):
        return obj.job.title
    
    def get_candidate_name(self, obj):
        return obj.candidate.get_full_name() or obj.candidate.username
    
    def get_resume_title(self, obj):
        if obj.resume:
            return obj.resume.title
        return None

class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True)
    password2 = serializers.CharField(write_only=True, required=True)
    role = serializers.ChoiceField(choices=UserProfile.USER_ROLES, required=True)
    company_name = serializers.CharField(required=False, allow_blank=True)
    phone_number = serializers.CharField(required=False, allow_blank=True)
    address = serializers.CharField(required=False, allow_blank=True)
    
    class Meta:
        model = User
        fields = ['username', 'password', 'password2', 'email', 'first_name', 'last_name', 
                  'role', 'company_name', 'phone_number', 'address']
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True}
        }
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs
    
    def create(self, validated_data):
        role = validated_data.pop('role')
        company_name = validated_data.pop('company_name', '')
        phone_number = validated_data.pop('phone_number', '')
        address = validated_data.pop('address', '')
        validated_data.pop('password2')
        
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )
        
        user.set_password(validated_data['password'])
        user.save()
        
        UserProfile.objects.create(
            user=user,
            role=role,
            company_name=company_name,
            phone_number=phone_number,
            address=address
        )
        
        return user