from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from website.models import Profile, GenderOptions

User = get_user_model()

class Command(BaseCommand):
    help = 'Creates a Profile for existing Users who do not have one.'

    def handle(self, *args, **options):
        self.stdout.write("Checking for users without profiles...")
        users_without_profiles = 0
        for user in User.objects.all():
            if not hasattr(user, 'profile') or user.profile is None:
                Profile.objects.create(user=user, gender=GenderOptions.RATHER_NOT_SAY.value)
                users_without_profiles += 1
                self.stdout.write(self.style.SUCCESS(f"Created profile for user: {user.username}"))
        
        if users_without_profiles > 0:
            self.stdout.write(self.style.SUCCESS(f"Successfully created {users_without_profiles} new profiles."))
        else:
            self.stdout.write(self.style.SUCCESS("All existing users already have profiles. No new profiles created."))