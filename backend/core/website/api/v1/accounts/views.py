from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Subquery, OuterRef
from website.models import User, ProfileQuestion, ProfileAnswer
from .forms import CustomUserCreationForm
from django.contrib.auth import login
from rest_framework.decorators import api_view, permission_classes

from .serializers import (
    GetUserTokenSerializer, ForgetPasswordSerializer, ProfileCreationSerializer,
    PersonalDetailCreationSerializer, ChangePasswordSerializer, UserSerializer,
    ProfileSerializer, SettingProfileInfoSerializer, SettingProfileChangeSerializer,
    SettingUsernameSendEmailSerializer, SettingEditUsernameSerializer, SettingProfileSerializer,
    SettingEditProfileAvatarSerializer, SettingEmailSendEmailSerializer, SettingEditEmailSerializer,
    ProfileAnswerSerializer, SettingProfileAnswerSerializer
)
from website.services import ForgetPasswordAuthenticationService


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    form = CustomUserCreationForm(request.POST)
    if form.is_valid():
        user = form.save()
        login(request, user)
        return Response({"detail": "Successfully registered."}, status=status.HTTP_201_CREATED)
    return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)


class CreateProfileView(GenericAPIView):
    """
    Signup Step2: update profile info
    """
    permission_classes = [IsAuthenticated]
    serializer_class = ProfileCreationSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        data = serializer.save()
        return Response(data, status=status.HTTP_201_CREATED)


class CreatePersonalDetailView(GenericAPIView):
    """
    Create detail user info view
    """
    permission_classes = [IsAuthenticated]
    serializer_class = PersonalDetailCreationSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        data = serializer.save()
        return Response(data, status=status.HTTP_201_CREATED)


class ForgetPasswordView(GenericAPIView):
    """
    Return OK and send otp code to user's email address
    in case of success.
    and return USER_NOT_FOUND error in case of failure
    """
    serializer_class = ForgetPasswordSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        auth_service = ForgetPasswordAuthenticationService()
        response = auth_service.forget_password_initializer(serializer.validated_data)
        return response


class GetUserTokenView(GenericAPIView):
    """
    Get email and token from user
    checks if they are valid
    """
    serializer_class = GetUserTokenSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        auth_service = ForgetPasswordAuthenticationService()
        response = auth_service.check_token(serializer.validated_data)
        return response


class ChangePasswordView(GenericAPIView):
    """
    Get email and validated token
    then change password
    """
    serializer_class = ChangePasswordSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        auth_service = ForgetPasswordAuthenticationService()
        response = auth_service.change_password(serializer.validated_data)
        return response


class GetUserTypeView(GenericAPIView):
    """
    Get user's type

    possible responses are:
        - common
        - admin

    """
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        return Response(request.user.get_which_type_display(), status=status.HTTP_200_OK)


class UserFullInfoView(GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = User.objects.get(id=self.request.user.id)
        profile = user.profile
        personal_detail = profile.personal_detail
        return user, profile, personal_detail

    def get(self, request, *args, **kwargs):
        user, profile, personal_detail = self.get_queryset()
        return Response({
            "user": UserSerializer(user).data,
            "profile": ProfileSerializer(profile, context={'request': request}).data,
            "personal_detail": PersonalDetailCreationSerializer(personal_detail).data
        })


class SettingEditProfileView(GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return SettingProfileInfoSerializer
        elif self.request.method == 'PATCH':
            return SettingProfileChangeSerializer

    def get_queryset(self):
        user = self.request.user
        return user

    def get(self, request, *args, **kwargs):
        serializer = self.get_serializer(self.get_queryset())
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, *args, **kwargs):
        serializer = self.get_serializer(instance=request.user.profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


class SettingUsernameSendEmailView(GenericAPIView):
    """
    USAGE: used when an user wants to change their username
    generates token for user and sends it via email
    for verification purposes
    """
    permission_classes = [IsAuthenticated]
    serializer_class = SettingUsernameSendEmailSerializer

    def post(self, request, *args, **kwargs):
        user_email = request.user.email
        serializer = self.serializer_class(context={"email":user_email})
        msg, stat = serializer.send_email()
        return Response(msg, status=stat)


class SettingEditUsernameView(GenericAPIView):
    """
    verifies the given token which is send to user email
    and changes the username if token is valid
    """
    permission_classes = [IsAuthenticated]
    serializer_class = SettingEditUsernameSerializer

    def post(self, request, *args, **kwargs):
        user_email = request.user.email
        serializer = self.serializer_class(
            data=request.data,
            context={"request":request}
        )
        serializer.is_valid(raise_exception=True)
        result = serializer.save()
        return Response(result, status=status.HTTP_200_OK)


class SettingProfileView(GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # profile
        profile = request.user.profile
        serializer_profile = SettingProfileSerializer(profile)

        # questions
        questions = self.get_not_answered_questions(profile)
        serializer_question = ProfileAnswerSerializer(
            questions, many=True
        )

        return Response(
            {
                "profile": serializer_profile.data,
                "questions": serializer_question.data
            },
            status=status.HTTP_200_OK
        )

    def get_not_answered_questions(self, user_profile):
        # # Subquery to get a list of question IDs with related answers
        # question_ids_with_answers = ProfileAnswer.objects.filter(
        #     profile=user_profile,
        #     question=OuterRef('id')
        # ).values('question')

        # # Query to get ProfileQuestions with no related ProfileAnswers
        # questions_with_no_answers = ProfileQuestion.objects.annotate(
        #     has_answers=Subquery(question_ids_with_answers)
        # ).filter(has_answers=None)

        # return questions_with_no_answers

        return ProfileQuestion.objects.all()

class SettingEditProfileAvatarView(GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = SettingEditProfileAvatarSerializer

    def patch(self, request, *args, **kwargs):
        serializer = self.serializer_class(
            instance=request.user.profile,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


class SettingEmailSendEmailView(GenericAPIView):
    """
    USAGE: used when an user wants to change they email
    generates token for user and sends it via email
    for verification purposes
    """
    permission_classes = [IsAuthenticated]
    serializer_class = SettingEmailSendEmailSerializer

    def post(self, request, *args, **kwargs):
        user_email = request.user.email
        serializer = self.serializer_class(context={"email":user_email})
        msg, stat = serializer.send_email()
        return Response(msg, status=stat)


class SettingEditEmailView(GenericAPIView):
    """
    verifies the given token which is send to user email
    and changes the email if token is valid
    """
    permission_classes = [IsAuthenticated]
    serializer_class = SettingEditEmailSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(
            context = {"request":request},
            data=request.data
        )
        serializer.is_valid(raise_exception=True)
        result = serializer.save()
        return Response(result, status=status.HTTP_200_OK)


class SettingProfileAnswerView(GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = SettingProfileAnswerSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data,
            context={"user":request.user}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
