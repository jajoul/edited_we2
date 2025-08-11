from django.urls import path, include
from rest_framework.routers import SimpleRouter
from .views import ChannelViewSet, FollowChannelView, ChannelOwnerView

router = SimpleRouter()
router.register('channel', ChannelViewSet)
endpoints = router.urls

app_name = 'v1/channels'

urlpatterns = [
    path('', include(endpoints)),
    path('channel/list/owner/', ChannelOwnerView.as_view(), name="owner"),
    path('channel/<int:pk>/follow', FollowChannelView.as_view(), name="follow"),
]