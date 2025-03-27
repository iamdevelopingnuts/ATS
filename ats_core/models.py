from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

# User Profile model to extend Django's built-in User model
class UserProfile(models.Model):
    USER_ROLES = (
        ('employer', 'Employer'),
        ('candidate', 'Candidate'),
        ('admin', 'Admin'),
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=USER_ROLES)
    company_name = models.CharField(max_length=100, blank=True, null=True)  # For employers
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.role}"

# Job model
class Job(models.Model):
    JOB_STATUS = (
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('filled', 'Filled'),
        ('expired', 'Expired'),
    )
    title = models.CharField(max_length=200)
    employer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='jobs')
    description = models.TextField()
    requirements = models.TextField()
    location = models.CharField(max_length=100)
    salary_range = models.CharField(max_length=100, blank=True, null=True)
    job_type = models.CharField(max_length=50, blank=True, null=True)  # Full-time, Part-time, Contract
    status = models.CharField(max_length=20, choices=JOB_STATUS, default='active')
    posted_date = models.DateTimeField(default=timezone.now)
    deadline = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title

# Resume model
class Resume(models.Model):
    candidate = models.ForeignKey(User, on_delete=models.CASCADE, related_name='resumes')
    title = models.CharField(max_length=100)
    file = models.FileField(upload_to='resumes/')
    upload_date = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.candidate.username}'s Resume - {self.title}"

# Application model
class Application(models.Model):
    APPLICATION_STATUS = (
        ('pending', 'Pending'),
        ('reviewed', 'Reviewed'),
        ('shortlisted', 'Shortlisted'),
        ('rejected', 'Rejected'),
        ('interview', 'Interview'),
        ('offered', 'Offered'),
        ('hired', 'Hired'),
    )
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    candidate = models.ForeignKey(User, on_delete=models.CASCADE, related_name='applications')
    resume = models.ForeignKey(Resume, on_delete=models.SET_NULL, null=True, blank=True)
    cover_letter = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=APPLICATION_STATUS, default='pending')
    application_date = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
    employer_notes = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.candidate.username}'s Application for {self.job.title}"
