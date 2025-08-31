from rest_framework import serializers, status
from django_elasticsearch_dsl_drf import serializers as esSerializer
from website.documents import ChannelDocument, TopicDocument
from website.models import Channel
from website.tools.exceptions import CustomException

class SearchChannelSerializer(esSerializer.DocumentSerializer):
    id = serializers.ReadOnlyField(source="meta.id")
    is_followed = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()

    class Meta:
        document = ChannelDocument
        fields = "__all__"

    def get_image(self, obj):
        if obj.image:
            request = self.context.get('request')
            protocol = request.scheme
            domain = request.get_host()
            return f'{protocol}://{domain}{obj.image}'
        return None

    def get_is_followed(self, obj):
        user_profile = self.context['request'].user.profile
        channel_id = obj.meta.id
        
        try:
            channel = Channel.objects.get(id=channel_id)
        except:
            raise CustomException(
                "Failed to get channel instance from postgres database",
                "error",
                status_code=status.HTTP_404_NOT_FOUND
            )
        
        if channel.creator == user_profile:
            return 2
        elif channel.members.filter(pk=user_profile.pk).count() > 0:
            return 1
        else:
            return 0
        

class SearchTopicSerializer(esSerializer.DocumentSerializer):
    id = serializers.ReadOnlyField(source="meta.id")
    channel_image = serializers.SerializerMethodField()

    class Meta:
        document = TopicDocument
        fields = "__all__"

    def get_channel_image(self, obj):
        if obj.channel_image:
            request = self.context.get('request')
            protocol = request.scheme
            domain = request.get_host()
            return f'{protocol}://{domain}{obj.channel_image}'
        return None
    

class SearchChannel2Serializer(serializers.ModelSerializer):
    is_followed = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    class Meta:
        model = Channel
        fields = ['title', 'image', 'which_type', "is_followed"]
    
    def get_image(self, obj):
        if obj.image:
            request = self.context.get('request')
            protocol = request.scheme
            domain = request.get_host()
            return f'{protocol}://{domain}{obj.image}'
        return None
    
    def get_is_followed(self, obj):
        user_profile = self.context['request'].user.profile
        
        if obj.creator == user_profile:
            return 2
        elif obj.members.filter(pk=user_profile.pk).count() > 0:
            return 1
        else:
            return 0
