from django.urls import path
from .views import (
    InitializeLiveView,
    StartLiveView,
    AddLiveMemberView,
    GetOnlineLivesView,
    EndLiveView,
    ScheduledLiveView,
    UploadVideoLiveView,
    GenerateTokenView,
    CreateRecordFile
)

urlpatterns = [
    path('init/', InitializeLiveView.as_view(), name='init_live'),
    path('start/', StartLiveView.as_view(), name='start_live'),
    path('end/', EndLiveView.as_view(), name='end_live'),
    path('record-file/', CreateRecordFile.as_view(), name='create_record'),
    path('online-lives/', GetOnlineLivesView.as_view(), name='get_online_lives'),
    path('add-member/', AddLiveMemberView.as_view(), name='add_live_member'),
    path('scheduled/', ScheduledLiveView.as_view(), name='scheduled_live'),
    path('upload/', UploadVideoLiveView.as_view(), name='upload_live'),
    path('generate-token/', GenerateTokenView.as_view(), name='generate_token'),
]