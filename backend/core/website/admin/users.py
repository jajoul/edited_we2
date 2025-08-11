from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from website.models import User, PersonalDetail

# Register your models here.
class CustomUserAdmin(UserAdmin):
    model = User
    list_display = [
        "username",
        "email",
        "which_type",
        "is_staff",
        "is_superuser",
        "is_active",
        "created_at",
        "updated_at",
    ]
    list_filter = ["is_staff", "is_superuser", "is_active", "which_type"]
    ordering = ["-created_at"]
    fieldsets = (
        ("Authentication", {"fields": ("username", "email", "password")}),
        (
            "Permissions",
            {
                "fields": (
                    "is_staff",
                    "is_active",
                    "is_superuser",
                    "which_type",
                )
            },
        ),
        ("Group permissions", {"fields": ("groups", "user_permissions")}),
        ("Important date", {"fields": ("last_login",)}),
    )
    add_fieldsets = (
        (
            "User info",
            {
                "classes": ("wide",),
                "fields": (
                    "username",
                    "email",
                    "which_type",
                    "password1",
                    "password2",
                    "is_staff",
                    "is_active",
                    "is_superuser",
                ),
            },
        ),
    )
admin.site.register(User, CustomUserAdmin)
admin.site.register(PersonalDetail)
