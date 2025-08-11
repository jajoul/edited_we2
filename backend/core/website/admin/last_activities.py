from django.contrib import admin
from website.models import LastActivities


class LastActivitiesAdmin(admin.ModelAdmin):
    list_display = ["id", "profile", "type",
                    "is_seen", "created_at", "updated_at"]
    list_filter = ["is_seen", "type"]
    search_fields = ["profile"]
admin.site.register(LastActivities, LastActivitiesAdmin)