from website.models import User
from rest_framework.response import Response
from rest_framework import status
from random import randint
from django_redis import get_redis_connection
from core.settings import DEBUG
from django.core.mail import send_mail
from django.conf import settings


class ForgetPasswordAuthenticationService:

    def __init__(self):
        self.from_token_value = 100_000
        self.to_token_value = 999_999
        self.token_expiration = 120
        self.key = "forget_password:"

    def forget_password_initializer(self, data):
        email = data.get('email')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response('User not found', status=status.HTTP_400_BAD_REQUEST)
        
        token = str(randint(self.from_token_value, self.to_token_value))
        redis_key = f"{self.key}{email}" 
        redis_connection = get_redis_connection()
        redis_connection.set(redis_key, token, ex=self.token_expiration)
        print(token, ' ------------------ token')
        send_mail("Forget Password Token", f"Your token is: {token} \nhttps://social.me2we2.com", settings.DEFAULT_FROM_EMAIL, [email])
        return Response('OK', status=status.HTTP_200_OK)
    
    def check_token(self, data):
        email = data.get('email')
        token = data.get('token')

        redis_connection = get_redis_connection()
        redis_key = f"{self.key}{email}" 
        cached_token = redis_connection.get(redis_key)
        ttl = redis_connection.ttl(redis_key)
        
        if not cached_token:
            return Response('Process Failed', status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        
        cached_token = cached_token.decode('utf-8')
        
        if cached_token != token:
            return Response('Invalid token', status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        
        if ttl == -2:
            return 'Token is expired', status.HTTP_406_NOT_ACCEPTABLE
        
        return Response(token, status=status.HTTP_200_OK)
    
    def change_password(self, data):
        email = data.get('email')
        # token = data.get('token')
        password = data.get('password1')

        redis_connection = get_redis_connection()
        redis_key = f"{self.key}{email}" 
        cached_token = redis_connection.get(redis_key)
        
        if not cached_token:
            return Response('Process Failed', status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        
        redis_connection.delete(email)
        
        user = User.objects.get(email=email)
        user.set_password(password)
        user.save()
        return Response('OK', status=status.HTTP_200_OK)


class ChangeUsernameAuthenticationService:

    def __init__(self):
        self.from_token_value = 100_000
        self.to_token_value = 999_999
        self.token_expiration = 600 #10 * 60sec
        self.key = "change_username:"

    def change_username_initializer(self, email):
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return 'User not found', status.HTTP_400_BAD_REQUEST
        
        redis_key = f"{self.key}{email}" 
        redis_connection = get_redis_connection()
        
        # Check if the token exists and is not expired
        existing_token = redis_connection.get(redis_key)
        
        # token has been generated for this email before
        # check its expiration time
        if existing_token:
            time_to_live = redis_connection.ttl(redis_key)
            
            # time_to_live starts from 600 and decreases each second
            if time_to_live > 480:
                # Token is still valid, warn user and do not generate new token
                return f"previous token is still active, try in {time_to_live - 480} seconds later",\
                        status.HTTP_406_NOT_ACCEPTABLE
                
                
        token = str(randint(self.from_token_value, self.to_token_value))
        redis_connection.set(redis_key, token, ex=self.token_expiration)
        
        # sending email progress
        try:
            if DEBUG:
                print("################################")
                print("##########  DEBUG MODE  ########")
                print(f"########  {self.key}  #####")
                print(f"email: {user.email}")
                print(f"token: {token}")
                print("################################")
            else:
                # implement sending email progress
                pass
            
            return "email send successfully", status.HTTP_200_OK
            
        except Exception as e:
            return "following error has raised during sending an email progress: {e}",\
                    status.HTTP_501_NOT_IMPLEMENTED
        
        
    def check_token(self, email, token):
        redis_connection = get_redis_connection()
        redis_key = f"{self.key}{email}" 
        cached_token = redis_connection.get(redis_key)
        ttl = redis_connection.ttl(redis_key)
        
        if not cached_token:
            return 'Process Failed', status.HTTP_422_UNPROCESSABLE_ENTITY
        
        cached_token = cached_token.decode('utf-8')
        if cached_token != token:
            return 'Invalid token', status.HTTP_422_UNPROCESSABLE_ENTITY
        
        if ttl == -2:
            return 'Token is expired', status.HTTP_406_NOT_ACCEPTABLE
        
        return "Token is valid", status.HTTP_200_OK
    
    def delete_redis_connection(self, email):
        redis_connection = get_redis_connection()
        redis_key = f"{self.key}{email}"
        cached_token = redis_connection.get(redis_key)
        
        if not cached_token:
            return 'failed to delete redis record', status.HTTP_422_UNPROCESSABLE_ENTITY
        
        redis_connection.delete(email)
        return 'OK', status.HTTP_200_OK
    
    
class ChangeEmailAuthenticationService(ChangeUsernameAuthenticationService):
    def __init__(self):
        super().__init__()
        self.key = "change_email:"

    def change_email_initializer(self, email):
        return super().change_username_initializer(email)