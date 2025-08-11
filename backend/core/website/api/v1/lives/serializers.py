from rest_framework import serializers
from website.models import Live, LiveStatusChoice


class GetOnlineLivesSerializer(serializers.ModelSerializer):
    """ Return all lives with specific status """

    class Meta:
        model = Live
        fields = ("id", "title", "description",
                  "room_id", "cover")


class InitializeLiveSerializer(serializers.Serializer):

    title = serializers.CharField()
    description = serializers.CharField()

    # Initialize live object with minimum data
    def create(self, validated_data):
        live_object = Live.objects.create(
            title=validated_data['title'],
            user=self.context['user'],
            description=validated_data['description']
        )
        return live_object
    

class StartLiveSerializer(serializers.Serializer):

    room_id = serializers.CharField()
    

class ScheduledLiveSerializer(serializers.ModelSerializer):
    """ Create object """
    class Meta:
        model = Live
        fields = ("title", "description",
                  "date", "cover")
        
    def create(self, validated_data):
        user = self.context.get('user')
        object = Live.objects.create(
            **validated_data,
            user=user
            )
        object.status = LiveStatusChoice.SCHEDULED.value
        object.save()
        return object


class UploadVideoLiveSerializer(serializers.ModelSerializer):
    """ Create object """
    class Meta:
        model = Live
        fields = ("title", "description",
                  "video", "cover", "url")
        
    def create(self, validated_data):
        user = self.context.get('user')
        object = Live.objects.create(
            **validated_data,
            user=user
            )
        object.status = LiveStatusChoice.PLAYBACK.value
        object.save()
        return object


class GenerateTokenSerializer(serializers.Serializer):
    """ Required data for generating token """
    room_name = serializers.CharField()
    participant_name = serializers.CharField()
    participant_type = serializers.CharField()
