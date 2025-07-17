from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView,TokenObtainPairView,TokenVerifyView

from .views import UserLoginView,UserRegisterView,UserLogoutView,UserProfileView,UserChangePasswordView,SendPasswordResetView,UserPasswordResetView
app_name = "user_auth"


urlpatterns = [
    path('api/register/', UserRegisterView.as_view(), name='register'),
    path('api/login/', UserLoginView.as_view(), name='login'),
    path('api/logout/', UserLogoutView.as_view(), name='logout'),
    path('api/profile/', UserProfileView.as_view(), name='profile'),
    path('api/change-password/', UserChangePasswordView.as_view(), name='change_password'),
    path('api/send-reset-password-email/', SendPasswordResetView.as_view(), name='reset_password'),
    path('api/reset-password/<uid>/<token>/', UserPasswordResetView.as_view(), name='reset_password'),
    path('api/token/refresh/',TokenRefreshView.as_view(),name="token_refresh"),

]
