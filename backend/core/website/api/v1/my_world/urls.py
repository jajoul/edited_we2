from django.urls import path
from .views import (
    UserFollowingChannelView, UserLikedTopicView, 
    UserCommentedTopicView, UserLastActivitiesView,
    CreateMeetView
)


app_name = 'v1/my_world'

urlpatterns = [
    path("following/channels/", UserFollowingChannelView.as_view(), name="followings"),
    path("liked/topics/", UserLikedTopicView.as_view(), name="liked-topics"),
    path("commented/topics/", UserCommentedTopicView.as_view(), name="commented-topics"),
    path("last-activities/", UserLastActivitiesView.as_view(), name="last-activities"),
    path("create-meet/", CreateMeetView.as_view(), name="create-meet"),
]
