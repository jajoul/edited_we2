from django.contrib import admin
from website.models import Profile, UserRecommendation


class ProfileAdmin(admin.ModelAdmin):
    list_display = ["user", "first_name", "last_name", "gender", "created_at", "updated_at"]
    search_fields = ["user", "first_name", "last_name"]
    list_filter = ["gender"]
    ordering = ["-created_at"]
admin.site.register(Profile, ProfileAdmin)


class UserRecommendationAdmin(admin.ModelAdmin):
    ...
admin.site.register(UserRecommendation, UserRecommendationAdmin)