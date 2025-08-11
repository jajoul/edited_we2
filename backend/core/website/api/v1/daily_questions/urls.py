from django.urls import path, include
from .views import (
    DailyQuestionView, DailyAnswerView
)

app_name = 'v1/daily_questions'

urlpatterns = [
    path("question/", DailyQuestionView.as_view(), name="question"),
    path("answer/", DailyAnswerView.as_view(), name='answer'),
]
