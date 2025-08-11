from django.contrib import admin
from website.models import DailyAnswer, DailyQuestion


class DailyQuestionAdmin(admin.ModelAdmin):
    list_display = ["id", "ques_statement", "created_at", "updated_at"]
    search_fields = ["ques_statement"]
    ordering = ["-created_at"]
admin.site.register(DailyQuestion, DailyQuestionAdmin)


class DailyAnswerAdmin(admin.ModelAdmin):
    list_display = ["id", "profile", "question", "created_at", "updated_at"]
    search_fields = ["profile", "question"]
    ordering = ["-created_at"]
admin.site.register(DailyAnswer, DailyAnswerAdmin)