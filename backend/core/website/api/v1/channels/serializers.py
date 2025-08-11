from rest_framework import serializers
from website.models import Channel
from rest_framework import serializers, status
from website.tools.exceptions import CustomException


class CreateChannelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Channel
        fields = ('id', 'image', 'title', 'about', 'which_type')

    def create(self, validated_data):
        validated_data['creator'] = self.context['profile']
        return super().create(validated_data)
    

class UpdateChannelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Channel
        fields = ('id', 'image', 'title', 'about')

    def validate(self, validated_data):
        if self.instance.creator != self.context['profile']:
            raise CustomException(
                "You are not the creator of this channel",
                "error",
                status_code=status.HTTP_400_BAD_REQUEST,
            )
        return super().validate(validated_data)

    def update(self, instance, validated_data):
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()
        return instance


class GetChannelSerializer(serializers.ModelSerializer):
    number_of_members = serializers.SerializerMethodField(method_name='count_members')
    is_followed = serializers.SerializerMethodField()
    is_editable = serializers.SerializerMethodField(method_name='is_owner')

    class Meta:
        model = Channel
        fields = ('id', 'image', 'title', 'about', 'which_type', 
                  'number_of_members', 'is_followed', 'is_editable')

    def is_owner(self, channel: Channel):
        user_profile = self.context['request'].user.profile
        return user_profile == channel.creator

    def update(self, instance, validated_data):
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()
        return instance
    
    def count_members(self, channel: Channel):
        return channel.members.all().count()

    def get_is_followed(self, obj):
        user_profile = self.context['request'].user.profile
        if user_profile == obj.creator:
            return 2
        if user_profile in obj.members.all():
            return 1
        else:
            return 0


class ChannelOwnerSerializer(serializers.ModelSerializer):
    """
    returns all of the channel which user is their owner
    """
    image = serializers.SerializerMethodField()
    is_editable = serializers.SerializerMethodField(method_name='is_owner')

    class Meta:
        model = Channel
        fields = ("id", "image", "title", 'is_editable')
        
    def is_owner(self, channel: Channel):
        user_profile = self.context['request'].user.profile
        return user_profile == channel.creator

    def get_image(self, obj):
        if obj.image:
            request = self.context.get('request')
            protocol = request.scheme
            domain = request.get_host()
            return f'{protocol}://{domain}{obj.image.url}'
        return None