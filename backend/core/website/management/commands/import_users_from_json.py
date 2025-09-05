import json
import os
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import transaction
from website.models import Profile, GenderOptions

User = get_user_model()


class Command(BaseCommand):
    help = 'Import users from ai_studio_code.json file into User and Profile models'

    def add_arguments(self, parser):
        parser.add_argument(
            '--file-path',
            type=str,
            default='ai_studio_code.json',
            help='Path to the JSON file containing user data (default: ai_studio_code.json)'
        )
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be imported without actually creating users'
        )
        parser.add_argument(
            '--skip-existing',
            action='store_true',
            help='Skip users that already exist (by email or username)'
        )

    def handle(self, *args, **options):
        file_path = options['file_path']
        dry_run = options['dry_run']
        skip_existing = options['skip_existing']
        
        # Get the absolute path to the JSON file
        if not os.path.isabs(file_path):
            # Go up from management/commands/ to core/ directory
            core_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
            file_path = os.path.join(core_dir, file_path)
        
        # Debug: print the resolved path
        self.stdout.write(f"Looking for file at: {file_path}")
        
        if not os.path.exists(file_path):
            self.stdout.write(
                self.style.ERROR(f"File not found: {file_path}")
            )
            return
        
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                users_data = json.load(file)
        except json.JSONDecodeError as e:
            self.stdout.write(
                self.style.ERROR(f"Invalid JSON file: {e}")
            )
            return
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f"Error reading file: {e}")
            )
            return
        
        if not isinstance(users_data, list):
            self.stdout.write(
                self.style.ERROR("JSON file should contain a list of user objects")
            )
            return
        
        self.stdout.write(f"Found {len(users_data)} users in the JSON file")
        
        if dry_run:
            self.stdout.write(self.style.WARNING("DRY RUN MODE - No users will be created"))
        
        created_users = 0
        skipped_users = 0
        errors = 0
        
        for user_data in users_data:
            try:
                result = self.process_user(user_data, dry_run, skip_existing)
                if result == 'created':
                    created_users += 1
                elif result == 'skipped':
                    skipped_users += 1
                elif result == 'error':
                    errors += 1
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f"Unexpected error processing user {user_data.get('Username', 'Unknown')}: {e}")
                )
                errors += 1
        
        # Summary
        self.stdout.write("\n" + "="*50)
        self.stdout.write("IMPORT SUMMARY")
        self.stdout.write("="*50)
        self.stdout.write(f"Total users processed: {len(users_data)}")
        self.stdout.write(f"Users created: {created_users}")
        self.stdout.write(f"Users skipped: {skipped_users}")
        self.stdout.write(f"Errors: {errors}")
        
        if dry_run:
            self.stdout.write(self.style.WARNING("This was a dry run - no actual changes were made"))

    def process_user(self, user_data, dry_run=False, skip_existing=False):
        """
        Process a single user from the JSON data
        Returns: 'created', 'skipped', or 'error'
        """
        # Extract data from JSON
        full_name = user_data.get('Full Name', '')
        username = user_data.get('Username', '')
        email = user_data.get('Email', '')
        password = user_data.get('Password', '')
        gender_str = user_data.get('Gender', '')
        
        # Validate required fields
        if not all([full_name, username, email, password]):
            self.stdout.write(
                self.style.ERROR(f"Skipping user due to missing required fields: {username}")
            )
            return 'error'
        
        # Check if user already exists
        existing_user_by_email = User.objects.filter(email=email).first()
        existing_user_by_username = User.objects.filter(username=username).first()
        
        if existing_user_by_email or existing_user_by_username:
            existing_user = existing_user_by_email or existing_user_by_username
            
            # Check if user has a profile
            if hasattr(existing_user, 'profile') and existing_user.profile:
                if skip_existing:
                    self.stdout.write(
                        self.style.WARNING(f"User {username} already exists with profile - skipping")
                    )
                    return 'skipped'
                else:
                    self.stdout.write(
                        self.style.ERROR(f"User {username} already exists with profile")
                    )
                    return 'error'
            else:
                # User exists but no profile - create profile for existing user
                if dry_run:
                    self.stdout.write(
                        f"Would create profile for existing user: {username} ({email})"
                    )
                    return 'created'
                
                try:
                    Profile.objects.create(
                        user=existing_user,
                        first_name=first_name,
                        last_name=last_name,
                        gender=gender,
                        show_name_in_chat=True
                    )
                    self.stdout.write(
                        self.style.SUCCESS(f"Created profile for existing user: {username}")
                    )
                    return 'created'
                except Exception as e:
                    self.stdout.write(
                        self.style.ERROR(f"Error creating profile for existing user {username}: {e}")
                    )
                    return 'error'
        
        # Parse full name into first and last name
        name_parts = full_name.strip().split(' ', 1)
        first_name = name_parts[0] if name_parts else ''
        last_name = name_parts[1] if len(name_parts) > 1 else ''
        
        # Map gender string to model choice
        gender_mapping = {
            'Male': GenderOptions.MALE.value,
            'Female': GenderOptions.FEMALE.value,
            'Neutral': GenderOptions.RATHER_NOT_SAY.value,
        }
        gender = gender_mapping.get(gender_str, GenderOptions.RATHER_NOT_SAY.value)
        
        if dry_run:
            self.stdout.write(
                f"Would create user: {username} ({email}) - {first_name} {last_name} - {gender_str}"
            )
            return 'created'
        
        # Create user and profile in a transaction
        try:
            with transaction.atomic():
                # Create User
                user = User.objects.create_user(
                    username=username,
                    email=email,
                    password=password,
                    is_active=True
                )
                
                # Check if profile already exists for this user
                if hasattr(user, 'profile') and user.profile:
                    self.stdout.write(
                        self.style.WARNING(f"Profile already exists for user {username} - skipping profile creation")
                    )
                else:
                    # Create Profile
                    Profile.objects.create(
                        user=user,
                        first_name=first_name,
                        last_name=last_name,
                        gender=gender,
                        show_name_in_chat=True
                    )
                
                self.stdout.write(
                    self.style.SUCCESS(f"Created user: {username} ({email})")
                )
                return 'created'
                
        except Exception as e:
            # If it's a duplicate key error, try to handle it gracefully
            if "Duplicate entry" in str(e) and "user_id" in str(e):
                self.stdout.write(
                    self.style.WARNING(f"User {username} may already exist with a profile - skipping")
                )
                return 'skipped'
            else:
                self.stdout.write(
                    self.style.ERROR(f"Error creating user {username}: {e}")
                )
                return 'error'
