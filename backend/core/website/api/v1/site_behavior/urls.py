from django.urls import path, include
from rest_framework.routers import SimpleRouter
from .views import (
    AdvertisementView, TopicViewSet, TrendTagsView, 
    NewTopicListView, ListTagView, ChannelTopicListView, 
    TopTopicsListView, RecommendedTopicsListView,
    TopicsYouFollowedListView, CommentViewSet,
    CommentReplyViewSet, LikeView, TopicByTagListView
)

app_name = 'v1/site_behavior'

router = SimpleRouter()
router.register('', TopicViewSet)
topic_routs = router.urls


urlpatterns = [
    # Topic
    path("topic/", include(topic_routs)),
    path("topic/channel/<int:pk>/", ChannelTopicListView.as_view(), name="list_channel_topics"),
    path("topic/list/newest/", NewTopicListView.as_view(), name="new_topics_list"),
    path("topic/list/top/", TopTopicsListView.as_view(), name="top_topic_list"),
    path("topic/list/followed/", TopicsYouFollowedListView.as_view(), name="topics-you-followed"),
    path("topic/list/recommended/", RecommendedTopicsListView.as_view(), name="recommended_topic_list"),
    path("topic/list/by-tag/<int:pk>/", TopicByTagListView.as_view(), name="by_tag_topic_list"),
    
    # Comment
    path("comments/topic/<int:topic_pk>/", CommentViewSet.as_view({"get":"list", "post":"create"}), name="comment-list"),
    path("comments/reply/<int:comment_pk>/", CommentReplyViewSet.as_view({"get":"list", "post":"create"}), name="comment-reply"),
    
    # Tag
    path("tags/", ListTagView.as_view(), name="list_tags"),
    path("tags/trend/", TrendTagsView.as_view(), name="trend_tags"),
    
    # Other 
    path("like/<int:topic_pk>/", LikeView.as_view(), name="like"),
    path("advertisement/", AdvertisementView.as_view({"get": "list"}), name="advertisement"),
]
