from django.urls import include, path
from rest_framework.routers import DefaultRouter
from apps.usr.views import (
    UserLoginView,
    UserLogoutView,
    CurrentUserDetailView,
    ChangePasswordView,
)

urlpatterns = [
    path('login/', UserLoginView.as_view(), name='login'),
    path('logout/', UserLogoutView.as_view(), name='logout'),
    path('me/change_password/', ChangePasswordView.as_view(), name='change_user_password'),
    path("me/", CurrentUserDetailView.as_view(), name="current-user")
]
