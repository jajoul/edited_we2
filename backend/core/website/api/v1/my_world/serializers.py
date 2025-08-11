import uuid
import hashlib
from rest_framework import serializers, status
from website.tools.exceptions import CustomException
from website.models import (
    Channel, Topic, LastActivities, Like, Comment
)


class UserFollowingChannelSerializer(serializers.ModelSerializer):
    is_followed = serializers.SerializerMethodField()
    
    class Meta:
        model = Channel
        fields = ["id", "title", "image", "which_type", "is_followed", "updated_at"]
    
    def get_is_followed(self, obj):
        user_profile = self.context['request'].user.profile
        if user_profile == obj.creator:
            return 2
        if user_profile in obj.members.all():
            return 1
        else:
            return 0
        

class UserLikedTopicSerializer(serializers.ModelSerializer):
    channel_info = serializers.SerializerMethodField()
    
    class Meta:
        model = Topic
        fields = ["id", "name", "likes_count", "comments_count", "picture", 
                  "which_type", "channel_info", "created_at", "updated_at"]
        
    def get_channel_info(self, obj):
        channel = obj.channel
        return {
            "title": channel.title,
            "image": channel.image.url
        }
        

class UserCommentedTopicSerializer(serializers.ModelSerializer):
    channel_info = serializers.SerializerMethodField()
    
    class Meta:
        model = Topic
        fields = ["id", "name", "likes_count", "comments_count", "picture", 
                  "which_type", "channel_info", "created_at", "updated_at"]
        
    def get_channel_info(self, obj):
        channel = obj.channel
        return {
            "title": channel.title,
            "image": channel.image.url
        }
        

class CommentInfo4UserLastActivitiesSerializer(serializers.ModelSerializer):
    topic_id = serializers.IntegerField(source="topic.id")
    topic_name = serializers.CharField(source="topic.name")
    commented_by = serializers.SerializerMethodField()
    
    class Meta:
        model = Comment
        fields = ["topic_id", "topic_name", "commented_by", "updated_at"]

    def get_commented_by(self, obj):
        commented_by_user_profile = obj.profile
        return commented_by_user_profile.first_name + " " + commented_by_user_profile.last_name

    def to_representation(self, instance):
        # change type of this activity to comment
        data = super().to_representation(instance)
        data["type"] = "comment"
        return data


class LikeInfo4UserLastActivitiesSerializer(serializers.ModelSerializer):
    topic_id = serializers.IntegerField(source="topic.id")
    topic_name = serializers.CharField(source="topic.name")
    liked_by = serializers.SerializerMethodField()
    like_count = serializers.IntegerField(source="topic.likes_count")
    
    class Meta:
        model = Like
        fields = ["topic_id", "topic_name", "liked_by", "like_count", "updated_at"]
        
    def get_liked_by(self, obj):
        liked_by_user_profile = obj.profile
        return liked_by_user_profile.first_name + " " + liked_by_user_profile.last_name
    
    def to_representation(self, instance):
        # change type of this activity to like
        data = super().to_representation(instance)
        data["type"] = "like"
        return data


class UserLastActivitiesSerializer(serializers.ModelSerializer):
    info = serializers.SerializerMethodField()
    class Meta:
        model = LastActivities
        fields = ["info", "is_seen", "updated_at"]
        
    def get_info(self, obj):
        if obj.type == "like":
            like_obj = obj.like
            like_serializer = LikeInfo4UserLastActivitiesSerializer(
                like_obj
            )
            return like_serializer.data
        
        elif obj.type == "comment":
            comment_obj = obj.comment
            comment_serializer = CommentInfo4UserLastActivitiesSerializer(
                comment_obj
            )
            return comment_serializer.data
        
        else:
            raise CustomException(
                f"obj id {obj.id} has no type",
                "error",
                status_code=status.HTTP_501_NOT_IMPLEMENTED
            )
            
    def to_representation(self, instance):
        # move all the info data into separated fields
        data = super().to_representation(instance)
        data["topic_id"] = data["info"]["topic_id"]
        data["topic_name"] = data["info"]["topic_name"]
        data["type"] = data["info"]["type"]
        
        who = data["info"].get("commented_by", None)
        if who:
            data["commented_by"] = data["info"]["commented_by"]
        else:
            data["liked_by"] = data["info"]["liked_by"]
        
        data.pop("info")
        return data
    
    
class CreateMeetSerializer(serializers.Serializer):
    def generate_meet_url(self):
        # Generate a unique identifier using UUID (Universally Unique Identifier)
        unique_id = uuid.uuid4().hex
        
        # Encode the unique identifier to bytes
        unique_id_bytes = unique_id.encode('utf-8')
        
        # Create a SHA-256 hash object
        sha256_hash = hashlib.sha256()
        
        # Update the hash object with the unique identifier bytes
        sha256_hash.update(unique_id_bytes)
        
        # Get the hexadecimal representation of the hashed data
        hashed_data = sha256_hash.hexdigest()
        
        # Serialize hash data
        data = {"meet_id": str(hashed_data)}
        
        return data
        