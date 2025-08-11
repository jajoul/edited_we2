from rest_framework import serializers, status
from website.tools.exceptions import CustomException
from website.models import (
    Advertise, Topic, Tag, Comment, UserRecommendation
)

class AdvertisementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Advertise
        exclude = ['created_at', 'updated_at']


class TagListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ('id', 'name')


class TopicCreationTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ('id',)


class TopicUpdateSerializer(serializers.ModelSerializer):
    # form data can not handle many to many field
    # so we need to use text field for getting ids
    tags = serializers.CharField()
    # tags = serializers.PrimaryKeyRelatedField(
    #     queryset=Tag.objects.all(),
    #     many=True,
    #     default=[],
    # )


    class Meta:
        model = Topic
        fields = ('id', 'name', 'description', 'location', 'video',
                  'picture', 'pdf', 'tags')
        
    def validate(self, attrs):
        # Only channel creator can add topic to it
        user_profile = self.context['request'].user.profile
        
        if self.instance.channel.creator != user_profile:
            raise CustomException(
                "Only channel creator can update this topic",
                "error",
                status_code=status.HTTP_403_FORBIDDEN
            )

        return super().validate(attrs)

    def update(self, instance, validated_data):
        
        # topic = super().update(instance, validated_data)
        # we had to get tag ids as text, so we need to return it to
        # to real related pks
        print(instance.name)
        str_tags = validated_data.get("tags")
        if str_tags is not None:
            self.id_list = list(map(int, str_tags.split(",")))
            instance.tags.set(self.id_list)

        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.location = validated_data.get('location', instance.location)
        instance.video = validated_data.get('video', instance.video)
        instance.picture = validated_data.get('picture', instance.picture)
        instance.pdf = validated_data.get('pdf', instance.pdf)

        instance.save()
        return instance

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if hasattr(self, 'is_list'):
            data['tags'] = self.id_list
        return data


class TopicCreateSerializer(serializers.ModelSerializer):
    # form data can not handle many to many field
    # so we need to use text field for getting ids
    tags = serializers.CharField() 
    # tags = serializers.PrimaryKeyRelatedField(
    #     queryset=Tag.objects.all(),
    #     many=True,
    #     default=[],
    # )


    class Meta:
        model = Topic
        fields = ('id', 'channel', 'name', 'description', 'location', 'video',
                  'picture', 'pdf', 'which_type', 'tags')
        
    def validate(self, attrs):
        # Only channel creator can add topic to it
        user_profile = self.context['request'].user.profile
        channel = attrs['channel']
        
        if channel.creator != user_profile:
            raise CustomException(
                "Only channel creator can add topic",
                "error",
                status_code=status.HTTP_403_FORBIDDEN
            )

        return super().validate(attrs)

    def create(self, validated_data):
        # we had to get tag ids as text, so we need to return it to
        # to real related pks
        str_tags = validated_data['tags']
        self.id_list = list(map(int, str_tags.split(",")))

        topic = Topic.objects.create(
            channel = validated_data.get('channel', None),
            name = validated_data.get('name', None),
            description = validated_data.get('description', None),
            location = validated_data.get('location', None),
            video = validated_data.get('video', None),
            picture = validated_data.get('picture', None),
            pdf = validated_data.get('pdf', None),
            which_type = validated_data.get('which_type', None),
            likes_count = validated_data.get('likes_count', 0),
            comments_count = validated_data.get('comments_count', 0)
        )

        topic.tags.set(self.id_list)
        topic.save()
        return topic

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['tags'] = self.id_list
        return data

class TopicListSerializer(serializers.ModelSerializer):
    tags = TagListSerializer(many=True)
    picture = serializers.SerializerMethodField(method_name='get_picture')
    likes_count = serializers.SerializerMethodField(method_name='count_likes')
    comments_count = serializers.SerializerMethodField(method_name='count_comments')
    channel_name = serializers.SerializerMethodField(method_name='get_channel_name')
    channel_image = serializers.SerializerMethodField(method_name='get_channel_image')
    is_editable = serializers.SerializerMethodField(method_name='is_owner')

    class Meta:
        model = Topic
        fields = ('id', 'channel', 'name', 'channel_name', 'channel_image', 'description', 'location', 'video',
                  'picture', 'pdf', 'which_type', 'likes_count', 'comments_count', 'tags', 'created_at', 'updated_at', 'is_editable')

    def is_owner(self, obj):
        request = self.context.get('request')
        if not hasattr(request.user, 'profile'):
            return False
        return request.user.profile == obj.channel.creator

    def get_picture(self, obj):
        if obj.picture:
            request = self.context.get('request')
            protocol = request.scheme
            domain = request.get_host()
            return f'{protocol}://{domain}{obj.picture.url}'
        return None
    
    def get_channel_name(self, obj):
        return obj.channel.title
    
    def get_channel_image(self, obj):
        if obj.channel.image:
            request = self.context.get('request')
            protocol = request.scheme
            domain = request.get_host()
            return f'{protocol}://{domain}{obj.channel.image.url}'
        return None
    
    def count_likes(self, obj):
        return obj.likes.all().count()
    
    def count_comments(self, obj):
        return obj.comments.all().count()


class CommentSerializer(serializers.ModelSerializer):
    profile_image = serializers.SerializerMethodField(method_name='get_profile_image')
    profile_name = serializers.SerializerMethodField(method_name='get_profile_name')
    reply_counter = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ('id', 'profile_image', 'profile_name', 'score', 
                  'content', 'reply_counter', 'created_at')

    def get_reply_counter(self, obj):
        return obj.replies.all().count()

    def get_profile_image(self, obj):
        if obj.profile.avatar:
            request = self.context.get('request')
            protocol = request.scheme
            domain = request.get_host()
            return f'{protocol}://{domain}{obj.profile.avatar.url}'
        return None
    
    def get_profile_name(self, obj):
        return obj.profile.first_name + ' ' + obj.profile.last_name

    def create(self, validated_data):
        user_profile = self.context['request'].user.profile
        validated_data['profile'] = user_profile

        topic_pk = self.context.get('topic_pk', None)
        comment_pk = self.context.get('comment_pk', None)
  
        if topic_pk:
            topic = Topic.objects.get(pk=topic_pk)
            validated_data['topic'] = topic
            
            # calculate tag score based on given stars
            stars = validated_data['score']
            if stars == 1:
                score = -2
            elif stars == 2:
                score = -1
            elif stars == 3:
                score = 0.5
            elif stars == 4:
                score = 1
            elif stars == 5:
                score = 2
            else:
                score = 0 

            # divide score to number of tags which are attached to this topic
            tags = topic.tags.all()
            tag_counter = tags.count()
            
            if tag_counter != 0:
                score /= tag_counter
                # Update user recommendation
                user_recommendation = user_profile.recommendation_tags
                for tag in tags:
                    if str(tag.id) in user_recommendation.tags:
                        user_recommendation.tags[str(tag.id)] = user_recommendation.tags[str(tag.id)] + score
                    else:
                        user_recommendation.tags[str(tag.id)] = score
                user_recommendation.save()

        elif comment_pk:
            comment = Comment.objects.get(pk=comment_pk)
            validated_data['comment'] = comment
            validated_data['topic'] = comment.topic
        
        else:
            raise CustomException(
                "no topic/comment pk selected",
                "error",
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        return super().create(validated_data)


class DetailTopicSerializer(serializers.ModelSerializer):
    tags = TagListSerializer(many=True)
    channel_name = serializers.SerializerMethodField(method_name='get_channel_name')
    channel_image = serializers.SerializerMethodField(method_name='get_channel_image')
    channel_id = serializers.IntegerField(source="channel.id")
    likes_count = serializers.SerializerMethodField(method_name='count_likes')
    comments_count = serializers.SerializerMethodField(method_name='count_comments')
    is_editable = serializers.SerializerMethodField(method_name='is_owner')

    class Meta:
        model = Topic
        fields = ('id', 'name', 'channel_name', 'channel_image', 'channel_id', 'likes_count', 
                  'comments_count', 'description', 'pdf', 'video', 'location', 'picture', 
                  'tags', 'created_at', 'which_type', 'comments', 'is_editable')
    
    def is_owner(self, obj):
        request = self.context.get('request')
        if not hasattr(request.user, 'profile'):
            return False
        return request.user.profile == obj.channel.creator
        
    def get_channel_name(self, obj):
        return obj.channel.title
    
    def get_channel_image(self, obj):
        if obj.channel.image:
            request = self.context.get('request')
            protocol = request.scheme
            domain = request.get_host()
            return f'{protocol}://{domain}{obj.channel.image.url}'
        return None
    
    def count_likes(self, obj):
        return obj.likes.all().count()
    
    def count_comments(self, obj):
        return obj.comments.all().count()


class ChannelTopicListSerializer(serializers.ModelSerializer):
    channel_id = serializers.IntegerField(source="channel.id")
    channel_name = serializers.SerializerMethodField(method_name='get_channel_name')
    channel_image = serializers.SerializerMethodField(method_name='get_channel_image')
    likes_count = serializers.SerializerMethodField(method_name='count_likes')
    comments_count = serializers.SerializerMethodField(method_name='count_comments')
    is_editable = serializers.SerializerMethodField(method_name='is_owner')

    class Meta:
        model = Topic
        fields = ('id', 'channel_id', 'name', 'channel_name', 'channel_image', 'which_type',
                  'likes_count', 'comments_count', 'created_at', 'updated_at', 'is_editable')
    
    def is_owner(self, obj):
        request = self.context.get('request')
        if not hasattr(request.user, 'profile'):
            return False
        return request.user.profile == obj.channel.creator
        
    def get_channel_name(self, obj):
        return obj.channel.title
    
    def get_channel_image(self, obj):
        if obj.channel.image:
            request = self.context.get('request')
            protocol = request.scheme
            domain = request.get_host()
            return f'{protocol}://{domain}{obj.channel.image.url}'
        return None
    
    #TODO: REMOVE LIKES FROM TOPIC MODEL
    def count_likes(self, obj):
        return obj.likes.all().count()
    
    #TODO: REMOVE COMMENTS FROM TOPIC MODEL
    def count_comments(self, obj):
        return obj.comments.all().count()


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ('id', 'name')


class CommentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = "__all__"

