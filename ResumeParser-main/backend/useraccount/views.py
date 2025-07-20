from django.shortcuts import render
from .serializers import LoginSerializer,UserSerializer,UserProfileSerializer,UserChangePasswordSerializer,SendPasswordResetSerializer,UserPasswordResetSerializer
from rest_framework.views import APIView
from django.http import Http404
from rest_framework import status
from rest_framework.response import Response
from django.contrib.auth import authenticate,logout,login
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .renderers import UserRenderer
from django.utils.http import urlsafe_base64_decode,urlsafe_base64_encode
from django.utils.encoding import smart_str,force_bytes,DjangoUnicodeDecodeError
from useraccount.models import User
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    
    return {
        'refresh':str(refresh),
        'access':str(refresh.access_token),
    }
    

class UserRegisterView(APIView):
    renderer_classes = [UserRenderer]
    def post(self,request,format=None):
        serializer = UserSerializer(data=request.data)
        
        if serializer.is_valid(raise_exception=True):
            user = serializer.save()
            token = get_tokens_for_user(user)
            return Response({'token':token,'message':'Register Successful'},status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    

class UserLoginView(APIView):
    renderer_classes = [UserRenderer]

    def post(self,request,format=None):
        serializer = LoginSerializer(data=request.data)
        
        if serializer.is_valid(raise_exception=True):
            email = serializer.data.get('email')
            password = serializer.data.get('password')
            
            user = authenticate(email=email,password=password)
            
            if user is not None:
                token = get_tokens_for_user(user)
                return Response({'message':'Login successful','role':user.role,'token':token},status=status.HTTP_200_OK)
            
            else:
                return Response({'errors':{'non_fields_errors':['Email or Password is not Valid']}},status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        

class UserProfileView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self,request,format=None):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data,status=status.HTTP_200_OK)
    


class UserChangePasswordView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    
    def post(self,request,format=None):
        serializer = UserChangePasswordSerializer(data=request.data,context={'user':request.user})
        
        if serializer.is_valid(raise_exception=True):
            return Response({'message':'Password Change successful'},status=status.HTTP_200_OK)

    
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    


class SendPasswordResetView(APIView):
    
    renderer_classes = [UserRenderer]
    
    def post(self,request,format=None):
        
        serializer = SendPasswordResetSerializer(data=request.data)
        
        if serializer.is_valid():
        
            return Response({'message':'Email sent successfully'},status=status.HTTP_200_OK)
    
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


class UserPasswordResetView(APIView):
    renderer_classes = [UserRenderer]
    
    def post(self,request,uid,token,format=None):
        serializer = UserPasswordResetSerializer(data=request.data,context={'uid':uid,'token':token})
          
        id = smart_str(urlsafe_base64_decode(uid))
        user = User.objects.get(id=id)
        if serializer.is_valid():
            print(user.password)
            print(user)
            return Response({'message':'Password reset successfully'},status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


    
class UserLogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        try:
            # Extract the refresh token from the request data
            refresh_token = request.data.get('refresh')
            if refresh_token is None:
                return Response({'message': 'Refresh token is required'}, status=status.HTTP_400_BAD_REQUEST)
            
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'message': 'Logout failed', 'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)