#!/usr/bin/env python
"""
Test script to verify user creation fix
Run this from the backend/core directory
"""

import os
import sys
import django

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.db import transaction
from website.models import User
from website.api.v1.accounts.serializers import UserCreationSerializer
from rest_framework import serializers
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_user_creation(username, email, password):
    """Test user creation process"""
    print(f"\n=== Testing User Creation ===")
    print(f"Username: {username}")
    print(f"Email: {email}")
    
    # Step 1: Check if user exists
    print("\n1. Checking if user exists...")
    if User.objects.filter(username__iexact=username).exists():
        print(f"   ⚠ User with username '{username}' already exists")
    else:
        print(f"   ✓ Username '{username}' is available")
        
    if User.objects.filter(email__iexact=email).exists():
        print(f"   ⚠ User with email '{email}' already exists")
    else:
        print(f"   ✓ Email '{email}' is available")
    
    # Step 2: Try to create user
    print("\n2. Attempting to create user...")
    try:
        data = {
            'username': username,
            'email': email,
            'password': password,
            'password2': password
        }
        
        serializer = UserCreationSerializer(data=data)
        
        if serializer.is_valid():
            print("   ✓ Serializer validation passed")
            
            try:
                with transaction.atomic():
                    user = serializer.save()
                    print(f"   ✓ User created successfully!")
                    print(f"      - ID: {user.id}")
                    print(f"      - Username: {user.username}")
                    print(f"      - Email: {user.email}")
                    return user
                    
            except Exception as e:
                print(f"   ✗ Error during user save: {e}")
                return None
        else:
            print(f"   ✗ Serializer validation failed:")
            for field, errors in serializer.errors.items():
                print(f"      - {field}: {errors}")
            return None
            
    except Exception as e:
        print(f"   ✗ Unexpected error: {e}")
        return None

def main():
    """Main test function"""
    print("User Creation Test Script")
    print("=" * 50)
    
    # Test case 1: New user
    print("\n" + "="*50)
    test_user_creation("testuser1", "test1@example.com", "TestPass123!")
    
    # Test case 2: Try to create same user again (should handle gracefully)
    print("\n" + "="*50)
    test_user_creation("testuser1", "test1@example.com", "TestPass123!")
    
    # Test case 3: Different username, same email
    print("\n" + "="*50)
    test_user_creation("testuser2", "test1@example.com", "TestPass123!")
    
    # Test case 4: Same username, different email
    print("\n" + "="*50)
    test_user_creation("testuser1", "test2@example.com", "TestPass123!")
    
    print("\n" + "="*50)
    print("Test completed!")

if __name__ == "__main__":
    main() 