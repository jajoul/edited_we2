from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import update_last_login
import re


def generate_jwt_for(user):
    """
    this method gets a user object, updated the last login info and returns access and
    refresh tokens
    """
    refresh = RefreshToken.for_user(user)

    update_last_login(None, user)

    data = {"refresh": str(refresh), "access": str(refresh.access_token)}
    return data


def check_username_validation(username):
    # Define the regular expression pattern for a valid username.
    pattern = r'^[a-zA-Z][a-zA-Z0-9_\-]{2,19}$'
    err = None
    
    if not re.match(pattern, username):
        errors = []
        if not re.match(r'^[a-zA-Z]', username):
            errors.append("Username must start with a letter.")
        if len(username) < 3 or len(username) > 20:
            errors.append("Username length must be between 3 and 20 characters.")
        if not re.match(r'^[a-zA-Z0-9_\-]*$', username):
            errors.append("Username can only contain letters, numbers, underscores, and hyphens.")
        if not errors:
            errors.append("Username has unknown problem.")    
        err = "Invalid username. " + " ".join(errors)

    return err