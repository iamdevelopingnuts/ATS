from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'profiles', views.UserProfileViewSet)
router.register(r'jobs', views.JobViewSet)
router.register(r'resumes', views.ResumeViewSet)
router.register(r'applications', views.ApplicationViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('search-jobs/', views.JobSearchView.as_view(), name='search-jobs'),
    path('employer-dashboard/', views.EmployerDashboardView.as_view(), name='employer-dashboard'),
    path('candidate-dashboard/', views.CandidateDashboardView.as_view(), name='candidate-dashboard'),
]