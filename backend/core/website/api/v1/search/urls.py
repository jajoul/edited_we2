from django.urls import path
from .views import SearchChannelView, SearchTopicView

app_name = 'v1/search'

urlpatterns = [
    #  User related endpoints
    path("channel/", SearchChannelView.as_view({'get':'list'}), name="channel"),
    # path("channel/", SearchChannelView2.as_view(), name="channel"),
    path("topic/", SearchTopicView.as_view({'get':'list'}), name="topic"),
]
