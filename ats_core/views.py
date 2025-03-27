from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.db.models import Q

from rest_framework import viewsets, generics, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken

from .models import UserProfile, Job, Resume, Application
from .serializers import (UserSerializer, UserProfileSerializer, JobSerializer, 
                          ResumeSerializer, ApplicationSerializer, RegisterSerializer)

# Authentication Views
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

class LoginView(APIView):
    permission_classes = (AllowAny,)
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        user = authenticate(username=username, password=password)
        
        if user is not None:
            refresh = RefreshToken.for_user(user)
            try:
                profile = UserProfile.objects.get(user=user)
                role = profile.role
            except UserProfile.DoesNotExist:
                role = None
                
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user_id': user.id,
                'username': user.username,
                'email': user.email,
                'role': role
            })
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

# ViewSets for CRUD operations
class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Admin can see all profiles, users can only see their own
        user = self.request.user
        try:
            profile = UserProfile.objects.get(user=user)
            if profile.role == 'admin':
                return UserProfile.objects.all()
            return UserProfile.objects.filter(user=user)
        except:
            return UserProfile.objects.filter(user=user)

class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [IsAuthenticated]
        else:
            self.permission_classes = [AllowAny]
        return super().get_permissions()
    
    def perform_create(self, serializer):
        serializer.save(employer=self.request.user)
    
    def get_queryset(self):
        queryset = Job.objects.all()
        status = self.request.query_params.get('status', None)
        if status is not None:
            queryset = queryset.filter(status=status)
        return queryset

class ResumeViewSet(viewsets.ModelViewSet):
    queryset = Resume.objects.all()
    serializer_class = ResumeSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(candidate=self.request.user)
    
    def get_queryset(self):
        user = self.request.user
        try:
            profile = UserProfile.objects.get(user=user)
            if profile.role == 'admin':
                return Resume.objects.all()
            elif profile.role == 'employer':
                # Employers can see resumes attached to applications for their jobs
                employer_jobs = Job.objects.filter(employer=user)
                applications = Application.objects.filter(job__in=employer_jobs)
                resume_ids = applications.values_list('resume_id', flat=True).distinct()
                return Resume.objects.filter(id__in=resume_ids)
            else:
                # Candidates can only see their own resumes
                return Resume.objects.filter(candidate=user)
        except:
            return Resume.objects.filter(candidate=user)

class ApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(candidate=self.request.user)
    
    def get_queryset(self):
        user = self.request.user
        try:
            profile = UserProfile.objects.get(user=user)
            if profile.role == 'admin':
                return Application.objects.all()
            elif profile.role == 'employer':
                # Employers can see applications for their jobs
                return Application.objects.filter(job__employer=user)
            else:
                # Candidates can only see their own applications
                return Application.objects.filter(candidate=user)
        except:
            return Application.objects.filter(candidate=user)

# Custom Views
class JobSearchView(generics.ListAPIView):
    serializer_class = JobSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        queryset = Job.objects.filter(status='active')
        search_term = self.request.query_params.get('search', None)
        location = self.request.query_params.get('location', None)
        job_type = self.request.query_params.get('job_type', None)
        
        if search_term:
            queryset = queryset.filter(
                Q(title__icontains=search_term) |
                Q(description__icontains=search_term) |
                Q(requirements__icontains=search_term)
            )
        
        if location:
            queryset = queryset.filter(location__icontains=location)
            
        if job_type:
            queryset = queryset.filter(job_type=job_type)
            
        return queryset

class EmployerDashboardView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            profile = UserProfile.objects.get(user=request.user)
            if profile.role != 'employer':
                return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
                
            # Get employer's jobs
            jobs = Job.objects.filter(employer=request.user)
            job_serializer = JobSerializer(jobs, many=True)
            
            # Get applications for employer's jobs
            applications = Application.objects.filter(job__employer=request.user)
            application_serializer = ApplicationSerializer(applications, many=True)
            
            # Get application statistics
            total_applications = applications.count()
            pending_applications = applications.filter(status='pending').count()
            reviewed_applications = applications.filter(status='reviewed').count()
            shortlisted_applications = applications.filter(status='shortlisted').count()
            
            return Response({
                'jobs': job_serializer.data,
                'applications': application_serializer.data,
                'stats': {
                    'total_applications': total_applications,
                    'pending_applications': pending_applications,
                    'reviewed_applications': reviewed_applications,
                    'shortlisted_applications': shortlisted_applications,
                }
            })
        except UserProfile.DoesNotExist:
            return Response({'error': 'User profile not found'}, status=status.HTTP_404_NOT_FOUND)

class CandidateDashboardView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            profile = UserProfile.objects.get(user=request.user)
            if profile.role != 'candidate':
                return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
                
            # Get candidate's applications
            applications = Application.objects.filter(candidate=request.user)
            application_serializer = ApplicationSerializer(applications, many=True)
            
            # Get candidate's resumes
            resumes = Resume.objects.filter(candidate=request.user)
            resume_serializer = ResumeSerializer(resumes, many=True)
            
            # Get application statistics
            total_applications = applications.count()
            pending_applications = applications.filter(status='pending').count()
            reviewed_applications = applications.filter(status='reviewed').count()
            interview_applications = applications.filter(status='interview').count()
            
            return Response({
                'applications': application_serializer.data,
                'resumes': resume_serializer.data,
                'stats': {
                    'total_applications': total_applications,
                    'pending_applications': pending_applications,
                    'reviewed_applications': reviewed_applications,
                    'interview_applications': interview_applications,
                }
            })
        except UserProfile.DoesNotExist:
            return Response({'error': 'User profile not found'}, status=status.HTTP_404_NOT_FOUND)
