from rest_framework import status
from django.utils.translation import gettext_lazy as _
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.contrib.auth.base_user import BaseUserManager
from website.tools.exceptions import CustomException
from website.models import BaseModel

class UserManager(BaseUserManager):
    """
    Custom user model manager where username and email is the unique
    identifiers for authentication.
    """
    def create_user(self, username, email, password, **extra_fields):
        """
        Create and save a user with the given username, email and password.
        """
        # set is_active to True so we can authenticate this user later
        extra_fields.setdefault("is_active", True)
        if extra_fields.get("is_active") is not True:
            raise ValueError()

        if not password:
            raise CustomException(
                "can not create user without password",
                "error",
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        try:
            email = self.normalize_email(email)
            user = self.model(username=username, email=email, **extra_fields)
            user.set_password(password)
            user.save()
            return user

        except Exception as e:
            raise CustomException(
                e,
                "error",
                status_code=status.HTTP_400_BAD_REQUEST,
            )
        

    def create_superuser(self, username, email, password, **extra_fields):
        """
        Create and save a SuperUser with the given username, email and password.
        """
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("which_type", UserTypes.ADMIN.value)

        if extra_fields.get("is_staff") is not True:
            raise ValueError()
        if extra_fields.get("is_superuser") is not True:
            raise ValueError()
        if extra_fields.get("is_active") is not True:
            raise ValueError()
        if extra_fields.get("which_type") is not UserTypes.ADMIN.value:
            raise ValueError()
        return self.create_user(username, email, password, **extra_fields)


class UserTypes(models.IntegerChoices):
    ADMIN = 0, _('admin')
    COMMON = 1, _('common')


class User(AbstractBaseUser, PermissionsMixin):
    # Data
    username = models.CharField(unique=True, max_length=100, null=False, blank=False)
    email = models.EmailField(unique=True, null=False, blank=False)
    which_type = models.IntegerField(default=UserTypes.COMMON.value, choices=UserTypes.choices)

    # Django required fields
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)

    # system information
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    objects = UserManager()

    def __str__(self):
        return f"User obj: {self.id}-{self.username}-{self.email}"
    

class GenderOptions(models.IntegerChoices):
    MALE = 0, _('Male')
    FEMALE = 1, _('Female')
    RATHER_NOT_SAY = 2, _('Rather not to say')
    

class Profile(models.Model):
    """
    All of the extra users information will be available here.
    Necessary data for authentication will be stored in User Table
    which is connected to this model via one to one field.
    """
    # Relations
    user = models.OneToOneField('website.User', related_name="profile", on_delete=models.CASCADE)
    
    # Data
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    avatar = models.ImageField(upload_to="avatar/", null=True, blank=True)
    gender = models.IntegerField(choices=GenderOptions.choices)
    show_name_in_chat = models.BooleanField(default=True)

    # system information
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"UserProfile: {self.id}-{self.user.username}"
    

class PersonalDetail(BaseModel):
    """
    User's detail personal info
    """
    # Relations
    profile = models.OneToOneField('website.Profile', related_name='personal_detail', on_delete=models.CASCADE)

    # Data
    favorites = models.TextField()
    difficulties = models.TextField()
    experiences = models.TextField()
    about = models.TextField()

    def __str__(self):
        return f"PersonalDetail obj: {self.id}-{self.profile.user.username}"


@receiver(post_save, sender=Profile)
def create_user_recommendation(sender, instance, created, **kwargs):
    if created:
        UserRecommendation.objects.create(profile=instance)

class UserRecommendation(BaseModel):
    """
    Recommendation which is a system based on tags will be saved here as json object,
    tags: will store all of the user preferred tags and their scores.
    example: {"tags":["tag1": 1.2, "tag2": 2.3]}
    """
    # Relations
    profile = models.OneToOneField('website.Profile', related_name='recommendation_tags', on_delete=models.CASCADE)
    
    # Data
    tags = models.JSONField(default=dict)

    def __str__(self):
        return f"UserRecommendation obj: {self.id}-{self.profile.user.username}"