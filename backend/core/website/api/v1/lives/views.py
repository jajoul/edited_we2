from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from datetime import datetime
from livekit import api
from django.db.models import Q
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from website.permissions import AdminOnly
from website.models import Live, LiveStatusChoice
from website.tools.constants import Constants
from .serializers import (InitializeLiveSerializer, ScheduledLiveSerializer,
                          StartLiveSerializer, GetOnlineLivesSerializer,
                          UploadVideoLiveSerializer, GenerateTokenSerializer)


class CreateRecordFile(GenericAPIView):
    """ Save record file object """
    def post(self, request, *args, **kwargs):
        file_path = Constants.BASE_MINIO_PATH + '/'.join(request.data['Key'].split('/')[:-1]) + '/'
        room_id = '-'.join(request.data['Key'].split('/')[-1].split('.')[0].split('-')[:-1])
        print(room_id)
        live_obj = Live.objects.get(room_id=room_id)
        record_obj = Live.objects.create(
            title=live_obj.title,
            user=live_obj.user,
            status=LiveStatusChoice.PLAYBACK.value,
            description=live_obj.description,
            url=file_path,
        )
        return Response("OK")


class InitializeLiveView(GenericAPIView):
    permission_classes = [IsAuthenticated, AdminOnly]

    """
    This view gets a title and a description of a live
    and creates a live instance with these values and init status
    """

    def post(self, request, *args, **kwargs):
        
        # Initialize live object with minimum data
        serialized_data = InitializeLiveSerializer(data=request.data, context={'user': request.user})
        serialized_data.is_valid(raise_exception=True)

        live_object = serialized_data.save()
        response = {
            'room_id': live_object.room_id,
            'title': live_object.title
        }

        return Response(response, status=status.HTTP_200_OK)


class StartLiveView(GenericAPIView):
    permission_classes = [AllowAny]

    """
    This view gets a room_id and queries for a live object
    with that room_id and status of INIT, if exist, change its
    status from INIT to ONLINE
    """

    def post(self, request, *args, **kwargs):
        
        # Start the live
        serialized_data = StartLiveSerializer(data=request.data)
        serialized_data.is_valid(raise_exception=True)
        live_object = Live.objects.filter(room_id=serialized_data.data['room_id'], status=LiveStatusChoice.INIT.value)
        if not live_object:
            return Response({'error': 'invalid room id'}, status=status.HTTP_400_BAD_REQUEST)
        live_object = live_object.first()
        live_object.status = LiveStatusChoice.ONLINE.value
        live_object.save()

        return Response(serialized_data.data, status=status.HTTP_200_OK)
    

class EndLiveView(GenericAPIView):
    permission_classes = [AllowAny]

    """
    This view gets a room_id and queries for a live object
    with that room_id and status of ONLINE, if exist, change its
    status from ONLINE to ENDED
    """

    def post(self, request, *args, **kwargs):
        
        # Start the live
        serialized_data = StartLiveSerializer(data=request.data)
        serialized_data.is_valid(raise_exception=True)
        live_object = Live.objects.filter(room_id=serialized_data.data['room_id'], status=LiveStatusChoice.ONLINE.value)
        if not live_object:
            return Response({'error': 'invalid room id'}, status=status.HTTP_400_BAD_REQUEST)
        live_object = live_object.first()
        live_object.status = LiveStatusChoice.ENDED.value
        live_object.save()

        return Response(serialized_data.data, status=status.HTTP_200_OK)


class AddLiveMemberView(GenericAPIView):
    permission_classes = [AllowAny]

    """
    This view gets a room_id and increases the member count by one
    """

    def post(self, request, *args, **kwargs):

        serialized_data = StartLiveSerializer(data=request.data)
        serialized_data.is_valid(raise_exception=True)
        live_objects = Live.objects.filter(room_id=serialized_data.data['room_id'], status=LiveStatusChoice.ONLINE.value)
        if not live_objects:
            return Response({'error': 'invalid room id'}, status=status.HTTP_400_BAD_REQUEST)
        live_object = live_objects.first()
        live_object.members_count += 1
        live_object.save()

        return Response(serialized_data.data, status=status.HTTP_200_OK)


class GetOnlineLivesView(GenericAPIView):
    queryset = Live.objects.filter(status=LiveStatusChoice.ONLINE.value)
    serializer_class = GetOnlineLivesSerializer
    permission_classes = [IsAuthenticated]

    """ Return all online lives to user """

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serialized_data = self.get_serializer(queryset, many=True)
        return Response(serialized_data.data, status=status.HTTP_200_OK)
    

class ScheduledLiveView(GenericAPIView):
    permission_classes = [IsAuthenticated, AdminOnly]
    
    """ Create a new scheduled live """

    def post(self, request, *args, **kwargs):
        """ create a new live """
        serialized = ScheduledLiveSerializer(data=request.data, context={"user": request.user})
        serialized.is_valid(raise_exception=True)
        serialized.save()
        return Response(serialized.data, status=status.HTTP_201_CREATED)
    
    def get(self, request, *args, **kwargs):
        """ Get all reasonable live objects"""
        # TODO: only up comming lives
        today_date = datetime.today().date()
        lives = Live.objects.filter(Q(date__gte=today_date) & Q(status=LiveStatusChoice.SCHEDULED.value))
        serialized = ScheduledLiveSerializer(lives, many=True)

        for i in range(len(serialized.data)):
            if serialized.data[i]['cover']:
                serialized.data[i]['cover'] = f"{request.scheme}://{request.get_host()}{serialized.data[i]['cover']}"
        return Response(serialized.data, status=status.HTTP_200_OK)
    

class UploadVideoLiveView(GenericAPIView):
    permission_classes = [IsAuthenticated, AdminOnly]
    
    """ Create a new scheduled live """

    def post(self, request, *args, **kwargs):
        """ create a new live """
        serialized = UploadVideoLiveSerializer(data=request.data, context={"user": request.user})
        serialized.is_valid(raise_exception=True)
        serialized.save()
        return Response(serialized.data, status=status.HTTP_201_CREATED)
    
    def get(self, request, *args, **kwargs):
        """ Get all reasonable live objects"""
        lives = Live.objects.filter(status=LiveStatusChoice.PLAYBACK.value)
        serialized = UploadVideoLiveSerializer(lives, many=True)

        for i in range(len(serialized.data)):
            if serialized.data[i]['cover']:
                serialized.data[i]['cover'] = f"{request.scheme}://{request.get_host()}{serialized.data[i]['cover']}"

        for i in range(len(serialized.data)):
            if serialized.data[i]['video']:
                serialized.data[i]['video'] = f"{request.scheme}://{request.get_host()}{serialized.data[i]['video']}"
        return Response(serialized.data, status=status.HTTP_200_OK)
    

class GenerateTokenView(GenericAPIView):
    """ Generate JWT token based on LiveKit API """
    serializer_class = GenerateTokenSerializer

    def post(self, request, *args, **kwargs):
        serialized = self.get_serializer(data=request.data)
        serialized.is_valid(raise_exception=True)

        if serialized.data['participant_type'] == Constants.PARTICIPANT_CONSUMER_TYPE:
            grants = api.VideoGrants(
                room_join=True, room=serialized.data['room_name'],
                can_publish=False, can_publish_data=False,
                can_subscribe=True, hidden=True
            )
        elif serialized.data['participant_type'] == Constants.PARTICIPANT_PRODUCER_TYPE:
            grants = api.VideoGrants(
                room_join=True, room=serialized.data['room_name'],
                can_publish=True, can_publish_sources=["camera", "microphone"],
                can_subscribe=False, hidden=False
            )
        else:
            return Response({"error": "invalid participant_type"}, status=status.HTTP_400_BAD_REQUEST)

        token = api.AccessToken(Constants.LIVEKIT_API_KEY,
                                Constants.LIVEKIT_SECRET_KEY).with_identity(
                                    serialized.data["participant_name"]
                                ).with_grants(grants)
        token = token.to_jwt()
        return Response({"token": token}, status=status.HTTP_200_OK)