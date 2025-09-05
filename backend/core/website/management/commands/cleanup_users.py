from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import transaction
from website.models import Profile

User = get_user_model()


class Command(BaseCommand):
    help = 'Clean up users and profiles - remove users without profiles or profiles without users'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be cleaned up without actually deleting anything'
        )
        parser.add_argument(
            '--remove-orphaned-profiles',
            action='store_true',
            help='Remove profiles that reference non-existent users'
        )
        parser.add_argument(
            '--remove-users-without-profiles',
            action='store_true',
            help='Remove users that do not have profiles'
        )

    def handle(self, *args, **options):
        dry_run = options['dry_run']
        remove_orphaned_profiles = options['remove_orphaned_profiles']
        remove_users_without_profiles = options['remove_users_without_profiles']
        
        if dry_run:
            self.stdout.write(self.style.WARNING("DRY RUN MODE - No changes will be made"))
        
        # Find orphaned profiles (profiles without users)
        if remove_orphaned_profiles:
            orphaned_profiles = Profile.objects.filter(user__isnull=True)
            count = orphaned_profiles.count()
            
            if count > 0:
                self.stdout.write(f"Found {count} orphaned profiles")
                if dry_run:
                    for profile in orphaned_profiles:
                        self.stdout.write(f"Would delete orphaned profile ID: {profile.id}")
                else:
                    orphaned_profiles.delete()
                    self.stdout.write(self.style.SUCCESS(f"Deleted {count} orphaned profiles"))
            else:
                self.stdout.write("No orphaned profiles found")
        
        # Find users without profiles
        if remove_users_without_profiles:
            users_without_profiles = User.objects.filter(profile__isnull=True)
            count = users_without_profiles.count()
            
            if count > 0:
                self.stdout.write(f"Found {count} users without profiles")
                if dry_run:
                    for user in users_without_profiles:
                        self.stdout.write(f"Would delete user: {user.username} ({user.email})")
                else:
                    users_without_profiles.delete()
                    self.stdout.write(self.style.SUCCESS(f"Deleted {count} users without profiles"))
            else:
                self.stdout.write("No users without profiles found")
        
        # Show current state
        total_users = User.objects.count()
        total_profiles = Profile.objects.count()
        users_with_profiles = User.objects.filter(profile__isnull=False).count()
        
        self.stdout.write("\n" + "="*50)
        self.stdout.write("CURRENT DATABASE STATE")
        self.stdout.write("="*50)
        self.stdout.write(f"Total users: {total_users}")
        self.stdout.write(f"Total profiles: {total_profiles}")
        self.stdout.write(f"Users with profiles: {users_with_profiles}")
        self.stdout.write(f"Users without profiles: {total_users - users_with_profiles}")
        self.stdout.write(f"Orphaned profiles: {total_profiles - users_with_profiles}")
