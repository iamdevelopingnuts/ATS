from django.contrib import admin
from .models import UserProfile, Job, Resume, Application

# Register models with the admin site
@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'role', 'company_name', 'phone_number')
    list_filter = ('role',)
    search_fields = ('user__username', 'user__email', 'company_name')

@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ('title', 'employer', 'location', 'status', 'posted_date')
    list_filter = ('status', 'job_type')
    search_fields = ('title', 'description', 'requirements')
    date_hierarchy = 'posted_date'

@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ('candidate', 'title', 'upload_date', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('candidate__username', 'title')

@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ('job', 'candidate', 'status', 'application_date')
    list_filter = ('status',)
    search_fields = ('job__title', 'candidate__username')
    date_hierarchy = 'application_date'
