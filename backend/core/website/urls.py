from django.urls import path, include


app_name = "website"

urlpatterns = [
    path("", include("website.api.v1.channels.urls")),
    path("v1/accounts/", include("website.api.v1.accounts.urls")),
    path("v1/daily_questions/", include("website.api.v1.daily_questions.urls")),
    path("v1/site_behavior/", include("website.api.v1.site_behavior.urls")),
    path("v1/search/", include("website.api.v1.search.urls")),
    path("v1/my_world/", include("website.api.v1.my_world.urls")),
    path("v1/live/", include("website.api.v1.lives.urls"))
]
