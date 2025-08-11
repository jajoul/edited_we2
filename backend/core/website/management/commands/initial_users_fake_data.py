from django.core.management.base import BaseCommand
from faker import Faker
from website.models import (
    User, Profile, PersonalDetail
)

class Command(BaseCommand):
    help = 'creates a superuser and a normal users at the initial project build'

    def __init__(self, *args, **kwargs):
        super(Command, self).__init__(*args, **kwargs)    
        self.faker = Faker()

    def handle(self, *args, **options):
        # creation of superuser
        try:
            user = User.objects.create_superuser(
                username="admin",
                email="admin@admin.com",
                password="#admin12345#"
            )
            self.stdout.write(self.style.SUCCESS("Superuser object Created successfully"))

            # create profile for superuser
            try:
                profile = Profile.objects.create(
                    user = user,
                    first_name = "admin_fname",
                    last_name = "admin_lname",
                    avatar = "/faker/admin.png",
                    gender = 2,
                )
                self.stdout.write(self.style.SUCCESS("Profile object Created for superuser successfully"))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Superuser object Created but failed to create Profile for it: {e}"))

            # create personal detail for superuser
            try:
                personal = PersonalDetail.objects.create(
                    profile = profile,
                    favorites = self.faker.sentence(),
                    difficulties = self.faker.sentence(),
                    experiences = self.faker.sentence(),
                    about = self.faker.sentence()
                )
                self.stdout.write(self.style.SUCCESS("Personal detail object Created for superuser successfully"))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Superuser object Created but failed to create Personal detail for it: {e}"))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Superuser already exists, or there is an error: {e}"))


        # creation of normal user
        try:
            user = User.objects.create_user(
                username="normal",
                email="normal@gmail.com",
                password="#admin12345#"
            )
            self.stdout.write(self.style.SUCCESS("Normal User Created successfully"))

            # create profile for normal user
            try:
                profile = Profile.objects.create(
                    user = user,
                    first_name = "normal_fname",
                    last_name = "normal_lname",
                    avatar = "/faker/normal_user.png",
                    gender = 2,
                )
                self.stdout.write(self.style.SUCCESS("Profile object Created for Normal user successfully"))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Normal user object Created but failed to create Profile for it: {e}"))

            # create personal detail for normal user
            try:
                personal = PersonalDetail.objects.create(
                    profile = profile,
                    favorites = self.faker.sentence(),
                    difficulties = self.faker.sentence(),
                    experiences = self.faker.sentence(),
                    about = self.faker.sentence()
                )
                self.stdout.write(self.style.SUCCESS("Personal detail object Created for Normal user successfully"))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Normal user object Created but failed to create Personal detail for it: {e}"))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Normal User already exists, or there is an error: {e}"))

