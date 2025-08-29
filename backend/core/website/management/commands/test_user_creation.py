from django.core.management.base import BaseCommand
from django.db import transaction
from website.models import User
from website.api.v1.accounts.serializers import UserCreationSerializer
from rest_framework import serializers
import logging
from django.db.models import Q

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Test user creation to debug race condition issues'

    def add_arguments(self, parser):
        parser.add_argument('--username', type=str, required=True)
        parser.add_argument('--email', type=str, required=True)
        parser.add_argument('--password', type=str, required=True)

    def handle(self, *args, **options):
        username = options['username']
        email = options['email']
        password = options['password']
        
        self.stdout.write(f"Testing user creation for username: {username}, email: {email}")
        
        # Test 1: Check if user exists before creation
        self.stdout.write("1. Checking if user exists before creation...")
        if User.objects.filter(username__iexact=username).exists():
            self.stdout.write(self.style.WARNING(f"User with username '{username}' already exists"))
        else:
            self.stdout.write("✓ Username is available")
            
        if User.objects.filter(email__iexact=email).exists():
            self.stdout.write(self.style.WARNING(f"User with email '{email}' already exists"))
        else:
            self.stdout.write("✓ Email is available")
        
        # Test 2: Try to create user with serializer
        self.stdout.write("\n2. Testing user creation with serializer...")
        try:
            data = {
                'username': username,
                'email': email,
                'password': password,
                'password2': password
            }
            
            serializer = UserCreationSerializer(data=data)
            if serializer.is_valid():
                self.stdout.write("✓ Serializer validation passed")
                
                # Test 3: Try to save user
                self.stdout.write("3. Testing user save...")
                try:
                    with transaction.atomic():
                        user = serializer.save()
                        self.stdout.write(self.style.SUCCESS(f"✓ User created successfully: {user.username} (ID: {user.id})"))
                        
                        # Test 4: Verify user exists in database
                        self.stdout.write("4. Verifying user exists in database...")
                        try:
                            db_user = User.objects.get(id=user.id)
                            self.stdout.write(self.style.SUCCESS(f"✓ User found in database: {db_user.username}"))
                        except User.DoesNotExist:
                            self.stdout.write(self.style.ERROR("✗ User not found in database"))
                            
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f"✗ Error during user save: {e}"))
                    
            else:
                self.stdout.write(self.style.ERROR(f"✗ Serializer validation failed: {serializer.errors}"))
                
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"✗ Unexpected error: {e}"))
        
        # Test 5: Check final state
        self.stdout.write("\n5. Final state check...")
        try:
            final_user = User.objects.get(
                Q(username__iexact=username) | Q(email__iexact=email)
            )
            self.stdout.write(self.style.SUCCESS(f"✓ User exists in final state: {final_user.username} (ID: {final_user.id})"))
        except User.DoesNotExist:
            self.stdout.write(self.style.WARNING("⚠ User does not exist in final state"))
        except User.MultipleObjectsReturned:
            self.stdout.write(self.style.ERROR("✗ Multiple users found with same username/email")) 