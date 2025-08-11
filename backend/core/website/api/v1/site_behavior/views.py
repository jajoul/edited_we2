from rest_framework.viewsets import ModelViewSet, ViewSet
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.db.models import Case, When, IntegerField, Sum, Count
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView, GenericAPIView
from website.tools.exceptions import CustomException
from website.models import Topic, Advertise, Tag, Channel, Comment, Like
from .serializers import (
    TopicListSerializer, AdvertisementSerializer, TopicCreateSerializer,
    TagSerializer, ChannelTopicListSerializer, DetailTopicSerializer, 
    TagListSerializer, CommentSerializer, TopicUpdateSerializer
)


class AdvertisementView(ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Advertise.objects.all()
    serializer_class = AdvertisementSerializer
    

class TopicViewSet(ModelViewSet):
    """
    ViewSet for CRUD operation on Topic model
    """
    permission_classes = [IsAuthenticated]
    queryset = Topic.objects.all()
    
    def get_queryset(self):
        queryset = self.queryset
        limit = self.request.query_params.get('limit', None)

        if limit:
            queryset = self.queryset[:int(limit)]

        return queryset

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return DetailTopicSerializer
        elif self.action == 'create':
            return TopicCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return TopicUpdateSerializer
        return TopicListSerializer
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class NewTopicListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ChannelTopicListSerializer

    def get_queryset(self):
        limit = self.request.query_params.get('limit', None)
        queryset = Topic.objects.all().order_by('-created_at')

        if limit:
            queryset = queryset[:int(limit)]

        return queryset

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class RecommendedTopicsListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TopicListSerializer

    def get_queryset(self):
        user_recommendation = self.request.user.profile.recommendation_tags
        tags = dict(sorted(user_recommendation.tags.items(), key=lambda x: x[1], reverse=True))
        all_topics = Topic.objects.all()
        topics = all_topics.annotate(
            recommendation_rate=Case(
                *[When(tags__pk=int(key), then=value) for key, value in tags.items()],
                default=0,
                output_field=IntegerField()
            )
        )

        topic_index = topics.values('id').annotate(total_recommendation_rate=Sum('recommendation_rate')).order_by('-total_recommendation_rate').values_list('id', flat=True)

        topics = all_topics.annotate(
            id_order=Case(
            *[When(id=id_val, then=index) for index, id_val in enumerate(topic_index)],
            default=len(all_topics)
            )
        ).order_by('id_order')


        # limit returned topics if there is any limit
        limit = self.request.query_params.get('limit', None)
        if limit:
            return topics[:int(limit)]
        return topics

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class ChannelTopicListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ChannelTopicListSerializer

    def get_queryset(self):
        pk = self.kwargs.get('pk')
        channel = get_object_or_404(Channel, pk=pk)
        queryset = channel.topics.all()

        # limit the queryset if there is any limit param
        limit = self.request.query_params.get('limit', None)
        if limit:
            queryset = queryset[:int(limit)]
        return queryset


    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class ListTagView(ListAPIView):
    """
    List all available tags
    """
    permission_classes = [IsAuthenticated]
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class TrendTagsView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TagListSerializer

    def get_queryset(self):
        return Tag.objects.annotate(trend_rate=Count('topic')).order_by('-trend_rate')[:5]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class TopTopicsListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = DetailTopicSerializer

    def get_queryset(self):
        tags = Tag.objects.annotate(
            trend_rate=Count('topic')
            ).order_by('-trend_rate')[:5].values_list('id', flat=True)
        
        queryset = Topic.objects.filter(tags__in=tags).distinct()
        
        # limit the queryset if there is any limit param
        limit = self.request.query_params.get('limit', None)
        if limit:
            queryset = queryset[:int(limit)]
        return queryset
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    

class TopicsYouFollowedListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ChannelTopicListSerializer

    def get_queryset(self):
        channels = self.request.user.profile.followed_channels.all()
        queryset = Topic.objects.filter(channel__in=channels)
        
        # limit the queryset if there is any limit param
        limit = self.request.query_params.get('limit', None)
        if limit:
            queryset = queryset[:int(limit)]
        return queryset
        

class CommentViewSet(ViewSet, GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CommentSerializer

    def get_queryset(self):
        topic_pk = self.kwargs.get('topic_pk')  
        return Comment.objects.filter(topic__id=topic_pk, comment=None)

    def list(self, request, *args, **kwargs):
        comments = self.get_queryset()
        context = {"request": self.request}
        serializer = self.serializer_class(comments, many=True, context=context)
        return Response(serializer.data)    
    
    def create(self, request, *args, **kwargs):
        topic_pk = kwargs.get('topic_pk')  
        context = {"request": self.request, "topic_pk": topic_pk}
        serializer = self.serializer_class(data=request.data, context=context)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class CommentReplyViewSet(ViewSet, GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CommentSerializer

    def get_queryset(self):
        comment_pk = self.kwargs.get('comment_pk')
        return Comment.objects.filter(comment__id=comment_pk)

    def list(self, request, *args, **kwargs):
        comments = self.get_queryset()
        context = {"request": self.request}
        serializer = self.serializer_class(comments, many=True, context=context)
        return Response(serializer.data)    
    
    def create(self, request, *args, **kwargs):
        comment_pk = kwargs.get('comment_pk')  
        context = {"request": self.request, "comment_pk": comment_pk}
        serializer = self.serializer_class(data=request.data, context=context)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    

class LikeView(GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, topic_pk, *args, **kwargs):
        is_liked = self.get_queryset(topic_pk)
        if is_liked:
            return Response({"is_liked": True})
        else:
            return Response({"is_liked": False})

    def post(self, request, topic_pk, *args, **kwargs):
        like, created = Like.objects.get_or_create(
            profile = request.user.profile,
            topic = self.get_topic(topic_pk)
        )

        if not created:
            return Response(
                {
                    "status": "this topic is already liked by this user"
                }, status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update user recommendation
        topic = like.topic
        tags = topic.tags.all()
        tags_count = tags.count()
        
        if tags_count != 0:
            score = 2 / tags_count
            user_profile = request.user.profile
            user_recommendation = user_profile.recommendation_tags
            
            for tag in tags:
                if str(tag.id) in user_recommendation.tags:
                    user_recommendation.tags[str(tag.id)] = user_recommendation.tags[str(tag.id)] + score
                else:
                    user_recommendation.tags[str(tag.id)] = score
            user_recommendation.save()

        return Response(
            {
                "status": "topic liked successfully"
            }, status=status.HTTP_200_OK
        )

    def delete(self, request, topic_pk, *args, **kwargs):
        like = self.get_queryset(topic_pk)
        if like is None:
            return Response({"status": "topic has not been liked before"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            # Update user recommendation
            topic = like.topic
            tags = topic.tags.all()
            tags_count = tags.count()
            
            # handling division by zero
            if tags_count != 0:
                score = 2 / tags_count
                user_profile = request.user.profile
                user_recommendation = user_profile.recommendation_tags
                
                for tag in tags:
                    if str(tag.id) in user_recommendation.tags:
                        user_recommendation.tags[str(tag.id)] = user_recommendation.tags[str(tag.id)] - score
                    else:
                        user_recommendation.tags[str(tag.id)] = score
                user_recommendation.save()
            
            like.delete()
            return Response({"status": "topic deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

    def get_queryset(self, topic_pk):
        topic = self.get_topic(topic_pk)
        try:
            return Like.objects.get(profile=self.request.user.profile, topic=topic)
        except:
            None
        
    def get_topic(self, topic_pk):
        try:
            return Topic.objects.get(pk=topic_pk)
        except:
            raise CustomException(
                "No topic found with the given pk",
                "error",
                status_code=status.HTTP_404_NOT_FOUND
            )
        

class TopicByTagListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ChannelTopicListSerializer

    def get_queryset(self):
        pk = self.kwargs.get('pk')
        queryset = Topic.objects.filter(tags=pk)
        return queryset