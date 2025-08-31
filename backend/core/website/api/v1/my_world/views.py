from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import GenericAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated
from .serializers import (
    UserFollowingChannelSerializer, UserLikedTopicSerializer,
    UserCommentedTopicSerializer, UserLastActivitiesSerializer,
    CreateMeetSerializer
)

class UserFollowingChannelView(ListAPIView):
    serializer_class = UserFollowingChannelSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        profile = self.request.user.profile
        followed_channels = profile.followed_channels.all()
        return followed_channels
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    

class UserLikedTopicView(ListAPIView):
    serializer_class = UserLikedTopicSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        profile = self.request.user.profile
        like_by_user = profile.likes.all()
        topic_objects = [like.topic for like in like_by_user]
        return topic_objects
    

class UserCommentedTopicView(ListAPIView):
    serializer_class = UserCommentedTopicSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        profile = self.request.user.profile
        comments = profile.comments.all()
        commented_topics = [comment.topic for comment in comments]
        return commented_topics
    
    
class UserLastActivitiesView(GenericAPIView):
    serializer_class = UserLastActivitiesSerializer
    permission_classes = [IsAuthenticated]
    
    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                'limit',
                openapi.IN_QUERY,
                description="Limit the number of activities returned.",
                type=openapi.TYPE_INTEGER
            ),
        ]
    )
    def get(self, request, *args, **kwargs):
        query = self.get_queryset()
        serializer = self.serializer_class(query, many=True)
        self.set_is_seen_true(query)
        return Response(serializer.data, status=status.HTTP_200_OK)
            
    def get_queryset(self):
        profile = self.request.user.profile
        last_activities = profile.last_activities.all()
        
        # check if any limit is requested
        limit = self.request.query_params.get('limit')
        if limit:
            # MySQL-compatible way to limit queryset
            ids = list(last_activities.order_by("-id").values_list('id', flat=True)[:int(limit)])
            last_activities = profile.last_activities.filter(id__in=ids).order_by("-id")
        return last_activities
    
    def set_is_seen_true(self, query):
        """
        after we get the result of queryset into serializer.data
        we have to set all of the query objects is_seen field to true
        """
        for q in query:
            q.is_seen = True
            q.save()
            
            
class CreateMeetView(GenericAPIView):
    serializer_class = CreateMeetSerializer
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        serializer = self.serializer_class()
        return Response(serializer.generate_meet_url(), status=status.HTTP_200_OK)