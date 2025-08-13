from django.contrib.auth.forms import UserCreationForm
from django import forms
from website.models import User


class CustomUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = User
        fields = ('username', 'email')
