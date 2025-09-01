from rest_framework.viewsets import ModelViewSet
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from website.models import Channel
from website.tools.exceptions import CustomException
from .serializers import (
    CreateChannelSerializer, UpdateChannelSerializer, GetChannelSerializer,
    ChannelOwnerSerializer
)


class ChannelViewSet(ModelViewSet):
    queryset = Channel.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ['create']:
            return CreateChannelSerializer
        
        elif self.action in ['update', 'partial_update']:
            return UpdateChannelSerializer
        
        elif self.action in ['retrieve', 'list']:
            return GetChannelSerializer
        
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['profile'] = self.request.user.profile
        return context
        
    def retrieve(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
        except:
            raise Response('Object does not exists', status=status.HTTP_400_BAD_REQUEST)
        serializer = self.get_serializer(instance, context={'request':request})
        return Response(serializer.data)

    # def create(self, request, *args, **kwargs):
    #     serializer = self.get_serializer(data=request.data)
    #     serializer.is_valid(raise_exception=True)
    #     channel = serializer.save()

    #     # Customize the response data here
    #     response_data = {
    #         'id': channel.id,
    #     }
    #     return Response(response_data, status=status.HTTP_201_CREATED)
    

class FollowChannelView(GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return Channel.objects.get(pk=pk)
        except Exception as e:
            raise CustomException(
                f"no channel found with the given pk",
                "error",
                status_code=status.HTTP_400_BAD_REQUEST
            )

    def post(self, request, pk, *args, **kwargs):
        channel = self.get_object(pk)
        user_profile = request.user.profile
        
        # Handle exception: following your own channel is not allowed
        if user_profile == channel.creator:
            raise CustomException(
                "following your own channel is not allowed",
                "error",
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        # Handle exception: raise error if user already followed the channel
        if user_profile in channel.members.all():
            raise CustomException(
                f"You already followed {channel.title}",
                "error",
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        channel.members.add(user_profile)
        channel.save()
        return Response({
            "status": f"channel {channel.title} followed successfully"
        })
    
    def delete(self, request, pk, *args, **kwargs):
        channel = self.get_object(pk)
        user_profile = request.user.profile
        
        # Handle exception: unfollowing your own channel is not allowed
        if user_profile == channel.creator:
            raise CustomException(
                "unfollowing your own channel is not allowed",
                "error",
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        # Handle exception: raise error if user already unfollowed the channel
        if user_profile not in channel.members.all():
            raise CustomException(
                f"You already unfollowed {channel.title}",
                "error",
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        channel.members.remove(user_profile)
        channel.save()
        return Response({
            "status": f"channel {channel.title} unfollowed successfully"
        })
        
        
class ChannelOwnerView(GenericAPIView):
    """
    returns all of the channels you created via get method
    """
    permission_classes = [IsAuthenticated]
    serializer_class = ChannelOwnerSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def get(self, request, *args, **kwargs):
        user_profile = request.user.profile
        channels = Channel.objects.filter(creator=user_profile)
        if not channels.exists():
            return Response([], status=status.HTTP_200_OK)
        
        serializer = self.get_serializer(channels, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)