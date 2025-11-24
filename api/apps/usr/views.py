import jwt, datetime
from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist
from django.core.mail import EmailMessage
from django.shortcuts import get_object_or_404
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.auth import login, logout, get_user_model, update_session_auth_hash
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.forms import SetPasswordForm

from rest_framework import status, generics, viewsets, mixins
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView

from api.apps.usr.serializers import (
    UserLoginSerializer,
    UserLogoutSerializer,
    UserSerializer,
    UserDeleteSerializer,
    UserChangePasswordSerializer,
    UserPasswordResetSerializer,
    UserPasswordResetConfirmSerializer,
)
from api.apps.usr.permissions import (
    IsApprover, 
    IsFinanceOfficer, 
    IsStaffOfficer
)
from apps.usr.utils import generate_jwt_token





# Login View
class UserLoginView(generics.GenericAPIView):
    serializer_class = UserLoginSerializer
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            validated_data = serializer.validated_data
            user = validated_data['user']
            message = validated_data['message']

            # Generate JWT token
            token = generate_jwt_token(user)
            login(request, user)
            response = Response(status=status.HTTP_200_OK)
            
            # Set JWT in an HttpOnly cookie
            response.set_cookie(
                key='jwt', 
                value=token,
                httponly=settings.JWT_COOKIE_HTTPONLY,
                secure=settings.JWT_COOKIE_SECURE,
                samesite='Lax'
            )

            response.data = {"message": message, "token": token}
            return response

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




# Logout View
class UserLogoutView(generics.GenericAPIView):
    serializer_class = UserLogoutSerializer
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        response = Response(status=status.HTTP_200_OK) 
        response.delete_cookie('jwt') 
        logout(request)
        response.data = {'message': 'Logout success!'}
        return response





