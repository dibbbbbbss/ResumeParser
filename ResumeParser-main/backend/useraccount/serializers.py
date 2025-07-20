from useraccount.models import User
from rest_framework import serializers
from django.utils.http import urlsafe_base64_decode,urlsafe_base64_encode
from django.utils.encoding import smart_str,force_bytes,DjangoUnicodeDecodeError
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from .utils import Util

from django.contrib.auth.hashers import check_password
class UserSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ('name','email','password','password2','role')
        extra_kwargs = {'password':{'write_only':True}}
        
    
    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Passwords and Confirm Password does not match")
        
     # Check the length of the username
        if len(data['name']) < 3:
            raise serializers.ValidationError("Username must be at least 3 characters long")
        if len(data['name']) > 15:
            raise serializers.ValidationError("Username must be less than 15 characters long")
        
          
        
        return data
    
    def validate_email(self,value):
        
        #Unique email
        
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already in use.")
        return value
    
    
    def validate_name(self, value):
        # Username uniqueness validation
        if User.objects.filter(name=value).exists():
            raise serializers.ValidationError("This username is already in use.")
        return value

    def create(self,validate_data):
        return User.objects.create_user(**validate_data)
    
    
    
    
class LoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(max_length=255)
    
    class Meta:
        model = User
        fields = ['email','password']
        
    
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['name','email','role']
        
        
class UserChangePasswordSerializer(serializers.Serializer):
    password = serializers.CharField(max_length=255,style={'input_type':'password'},write_only=True)
    password2 = serializers.CharField(max_length=255,style={'input_type':'password'},write_only=True)
    
        
    def validate(self,attrs):
        password = attrs.get('password')
        password2 = attrs.get('password2')
        user = self.context.get('user')
        
        if not check_password(password,user.password):
            raise serializers.ValidationError('New password must be different from the current password.')
        
        if password != password2:
            raise serializers.ValidationError('Password and Confirm Password doesnot match')
        
        user.set_password(password)
        
        user.save()
        
        return attrs
    
    
    

class SendPasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=255)
    
    def validate(self,attrs):
        email = attrs.get('email')
        
        
        if User.objects.filter(email=email).exists():
            user = User.objects.get(email=email)
            uid = urlsafe_base64_encode(force_bytes(user.id))
            print('Encoded uid',uid)
            
            token = PasswordResetTokenGenerator().make_token(user)
            print('Password reset token',token)
            
            link = 'http://localhost:3000/reset-password/' + uid + '/' + token
            
            print('Password reset link',link)
            
            #send email
            body = 'Click the following link to reset your password' + ' ' +link
            data = {
                "subject":"Reset Your Password",
                "body":body,
                "to_email":user.email
            }
            
            Util.send_email(data)
            return attrs
            
        else:
            raise serializers.ValidationError('You are not registered user')
            
            
        
class UserPasswordResetSerializer(serializers.Serializer):
    password2 = serializers.CharField(max_length=255,style={'input_type':'password'},write_only=True)
    password = serializers.CharField(max_length=255,style={'input_type':'password'},write_only=True)
    
    

    def validate(self,attrs):
        try:
            password = attrs.get('password')
            password2 = attrs.get('password2')
            
            uid = self.context.get('uid')
            token = self.context.get('token')
            
            id = smart_str(urlsafe_base64_decode(uid))
            user = User.objects.get(id=id)

            if not PasswordResetTokenGenerator().check_token(user,token):
                raise serializers.ValidationError('Token is not valid or expired.')    
            
            if password != password2:
                raise serializers.ValidationError('Password and Confirm Password doesnot match')    
            
            
            if check_password(password,user.password):
                raise serializers.ValidationError('New password must be different from the current password.')
            
            
            user.set_password(password)
            
            user.save()
            
            return attrs
        
        except DjangoUnicodeDecodeError:
            PasswordResetTokenGenerator().check_token(user,token)
            raise serializers.ValidationError('Token is not valid or expired.')
        
        
        