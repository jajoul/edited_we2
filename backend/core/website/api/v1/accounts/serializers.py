from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers, status
from django.contrib.auth.password_validation import validate_password
from operator import contains
from website.models import (
    User, Profile, PersonalDetail, ProfileQuestion, ProfileAnswer
)
from website.tools.exceptions import CustomException
from website.services.auth_services import (
    ChangeUsernameAuthenticationService,
    ForgetPasswordAuthenticationService,
    ChangeEmailAuthenticationService
)
from website.tools.auth import check_username_validation


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = User.USERNAME_FIELD


class UserCreationSerializer(serializers.ModelSerializer):
    """
    First Step of signup: create user instance and save user information
    """
    password2 = serializers.CharField(write_only=True, required=True)
    class Meta:
        model = User
        fields = ("username", "email", "password", "password2")
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate(self, attrs):
        # check if password2 is the same as password
        if attrs["password2"] != attrs["password"]:
            raise serializers.ValidationError({"password": "Passwords do not match"})

        # validate password
        try:
            validate_password(attrs["password"])
        except Exception as e:
            raise serializers.ValidationError({"password": e.args})
            
        attrs.pop('password2')
        return attrs
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user


class ProfileCreationSerializer(serializers.ModelSerializer):
    """
    Second Step of signup: create profile instance and save profile information
    """
    class Meta:
        model = Profile
        fields = ("first_name", "last_name", "avatar", "gender")

    def create(self, validated_data):
        request = self.context.get('request')
        user = None
        if request and hasattr(request, 'user') and request.user.is_authenticated:
            user = request.user
        elif 'user_id' in validated_data:
            from website.models import User
            try:
                user = User.objects.get(id=validated_data.pop('user_id'))
            except User.DoesNotExist:
                raise serializers.ValidationError("User does not exist")
        else:
            raise serializers.ValidationError("Authentication required or user_id must be provided")
        validated_data["user"] = user
        profile = super().create(validated_data)
        return {"message": "user profile created successfully"}
    

class ProfileSerializer(serializers.ModelSerializer):
    """
    Second Step of signup: create profile instance and save profile information
    """
    # avatar = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ("first_name", "last_name", "avatar", "gender")

    def get_avatar(self, obj):
        if obj.avatar:
            request = self.context.get('request')
            protocol = request.scheme
            domain = request.get_host()
            return f'{protocol}://{domain}{obj.avatar.url}'
        return None

class PersonalDetailCreationSerializer(serializers.ModelSerializer):
    """
    Creating an object for users detail info
    """
    class Meta:
        model = PersonalDetail
        fields = ('favorites', 'difficulties', 'experiences', 'about')

    def validate(self, attrs):

        user = self.context["request"].user
        if not hasattr(user, 'profile'):
            raise CustomException(
                "No profile created for user",
                "error",
                status_code=status.HTTP_401_UNAUTHORIZED,
            )

        return super().validate(attrs)

    def create(self, validated_data, user=None):
        # attach user (as required field) to profile validated data
        validated_data["profile"] = self.context["request"].user.profile
        super().create(validated_data)
        return {"message": "user detail created successfully"}
    

class LoginSerializer(TokenObtainPairSerializer):
    def __init__(self, *args, **kwargs):
        # changing the default username field to email
        self.username_field = "email"
        return super().__init__(*args, **kwargs)

    def validate(self, attrs):

        # Raise an error in case of invalid user and return tokens in case of success
        response = super().validate(attrs)

        # Check weather or not the requested user has complete profile
        user = User.objects.get(email=attrs['email'])

        # this parameter illustrates to which page user needs to be redirected after logging in
        response['destination'] = 0

        if not hasattr(user, 'profile'):
            response['destination'] = 1

        elif not hasattr(user.profile, 'personal_detail'):
            response['destination'] = 2

        return response
    

class ForgetPasswordSerializer(serializers.Serializer):

    email = serializers.CharField(required=True)


class GetUserTokenSerializer(serializers.Serializer):

    email = serializers.CharField(required=True)
    token = serializers.CharField(required=True)


class ChangePasswordSerializer(serializers.Serializer):

    email = serializers.CharField(required=True)
    token = serializers.CharField(required=True)
    password1 = serializers.CharField(required=True)
    password2 = serializers.CharField(required=True)

    def validate(self, attrs):

        if attrs['password1'] != attrs['password2']:
            raise CustomException(
                "Passwords are not identical",
                "error",
                status_code=status.HTTP_400_BAD_REQUEST,
            )
        attrs.pop('password2')

        # validate password
        try:
            validate_password(attrs["password1"])
        except Exception as e:
            raise CustomException(
                f"password is not valid: {e}",
                "error",
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        return super().validate(attrs)
    

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = ['password']
        

class SettingProfileInfoSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source="profile.first_name")
    last_name = serializers.CharField(source="profile.last_name")
    gender = serializers.CharField(source="profile.gender")
    show_name_in_chat = serializers.BooleanField(source="profile.show_name_in_chat")
    
    class Meta:
        model = User
        fields = ["show_name_in_chat", "first_name", "last_name", "gender", "username", "email"]
        

class SettingProfileChangeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["show_name_in_chat", "first_name", "last_name", "gender"]
        
        
class SettingUsernameSendEmailSerializer(serializers.Serializer):
    def send_email(self):
        # redis service connection
        email = self.context["email"]
        redis = ChangeUsernameAuthenticationService()
        msg, stat = redis.change_username_initializer(email)
        
        # error handler
        if stat != status.HTTP_200_OK:
            raise CustomException(
                msg, "detail", status_code=stat
            )
        return msg, stat
    
    
class SettingEditUsernameSerializer(serializers.ModelSerializer):
    token = serializers.CharField(required=True)
    class Meta:
        model = User
        fields = ["username", "token"]
        
    def validate(self, attrs):
        email = self.context["request"].user.email
        
        # check given token
        redis = ChangeUsernameAuthenticationService()
        msg, stat = redis.check_token(email, attrs["token"])
        
        if stat != status.HTTP_200_OK:
            # error handler
            raise CustomException(
                msg, "detail", stat
            )
        
        # check given username
        err = check_username_validation(attrs["username"])
        if err is None:
            # there is no error
            pass
        else:
            # error acquired during username validation
            raise CustomException(
                f"{err}", "detail", status_code=status.HTTP_400_BAD_REQUEST
            )

        return super().validate(attrs)
    
    def create(self, validated_data):
        try:
            user = self.context["request"].user
            user.username = validated_data["username"]
            user.save()
            
            # redis is no longer needed, remove this record
            redis = ChangeUsernameAuthenticationService()
            msg, stat = redis.delete_redis_connection(user.email)
            
            if stat != status.HTTP_200_OK:
                # error handler
                raise CustomException(
                    msg, "detail", stat
                )
            
            return {"detail": "username changed successfully"}
        
        except Exception as e:
            raise CustomException(
                f"error acquired during changing username: {e}",
                "detail",
                status_code=status.HTTP_501_NOT_IMPLEMENTED
            )
            
            
class SettingProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email")
    class Meta:
        model = Profile
        fields = ["avatar", "first_name", "last_name", "email"]
        
        
class SettingEditProfileAvatarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["avatar"]
        
        
class SettingEmailSendEmailSerializer(serializers.Serializer):
    def send_email(self):
        # redis service connection
        email = self.context["email"]
        redis = ChangeEmailAuthenticationService()
        msg, stat = redis.change_email_initializer(email)
        
        # error handler
        if stat != status.HTTP_200_OK:
            raise CustomException(
                msg, "detail", status_code=stat
            )
        return msg, stat
    

class SettingEditEmailSerializer(serializers.ModelSerializer):
    token = serializers.CharField(required=True)
    class Meta:
        model = User
        fields = ["email", "token"]
    
    def validate(self, attrs):
        previous_email = self.context["request"].user.email
        # check given token
        redis = ChangeEmailAuthenticationService()
        msg, stat = redis.check_token(previous_email, attrs["token"])
        
        if stat != status.HTTP_200_OK:
            # error handler
            raise CustomException(
                msg, "detail", stat
            )
        return super().validate(attrs)
    
    def create(self, validated_data):
        previous_email = self.context["request"].user.email
        try:
            user = self.context["request"].user
            user.email = validated_data["email"]
            user.save()
            
            # redis is no longer needed, remove this record
            redis = ChangeEmailAuthenticationService()
            msg, stat = redis.delete_redis_connection(previous_email)
            
            if stat != status.HTTP_200_OK:
                # error handler
                raise CustomException(
                    msg, "detail", stat
                )
            
            return {"detail": "email changed successfully"}
        
        except Exception as e:
            raise CustomException(
                f"error acquired during changing email: {e}",
                "detail",
                status_code=status.HTTP_501_NOT_IMPLEMENTED
            )
            
            
class ProfileAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileQuestion
        fields = ["id", "mode", "ques_statement", "opt1_statement", "opt2_statement", 
                  "opt3_statement", "opt4_statement"]
        
    def to_representation(self, instance):
        data = super().to_representation(instance)
        
        # format1: 4 option answer
        if data["mode"] == "4_opt":
            return data
        
        # format2: 2 option answer
        elif data["mode"] == "2_opt":
            data.pop("opt3_statement")
            data.pop("opt4_statement")
            return data
            
        # format3: text answer
        elif data["mode"] == "text":
            data.pop("opt1_statement")
            data.pop("opt2_statement")
            data.pop("opt3_statement")
            data.pop("opt4_statement")
            return data
        
        else:
            raise CustomException(
                "selected mode is not valid",
                "detail",
                status_code=status.HTTP_501_NOT_IMPLEMENTED
            )
            
            
class SettingProfileAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileAnswer          
        fields = ["question", "content"]
        
    def validate(self, attrs):
        # check if the given answer matches with the question mode and statements
        question = attrs["question"]
        if question.mode == "4_opt":
            # check if the given answer matches any of 4 options
            options = [question.opt1_statement, question.opt2_statement, 
                       question.opt3_statement, question.opt4_statement]
            if not contains(options, attrs["content"]):
                raise CustomException(
                    "given answer is not valid",
                    "detail",
                    status_code=status.HTTP_400_BAD_REQUEST
                )
                
        elif question.mode == "2_opt":
            # check if the given answer matches with option1 or option2
            options = [question.opt1_statement, question.opt2_statement]
            if not contains(options, attrs["content"]):
                raise CustomException(
                    "given answer is not valid",
                    "detail",
                    status_code=status.HTTP_400_BAD_REQUEST
                )
        
        elif question.mode == "text":
            # check if the given answer is not empty
            if attrs["content"] is None:
                raise CustomException(
                    "given answer can not be empty",
                    "detail",
                    status_code=status.HTTP_400_BAD_REQUEST
                )
                
        else:
            raise CustomException(
                "question mode is not valid",
                "detail",
                status_code=status.HTTP_501_NOT_IMPLEMENTED
            )
        
        # check if user already answered this question before
        # getting all of the already_answered_questions
        user_profile = self.context["user"].profile
        user_profile_answers = user_profile.profile_answers.all()
        already_answered_questions = ProfileQuestion.objects.filter(
            profile_answers__in=user_profile_answers
        ).distinct()
        
        # check if the current question is in already_answered_questions
        if question in already_answered_questions:
            raise CustomException(
                "you have answered this question before",
                "detail",
                status_code=status.HTTP_400_BAD_REQUEST
            )
            
        attrs["profile"] = user_profile
        return super().validate(attrs)  
