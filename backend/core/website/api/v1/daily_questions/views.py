from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from website.tools.exceptions import CustomException
from website.models import DailyQuestion, DailyAnswer
from .serializers import (
    DailyQuestionSerializer, DailyAnswerSerializer
)


class DailyQuestionView(GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = DailyQuestionSerializer
    
    def get_daily_question(self, profile):
        # Check if user answered any questions before
        try:
            user_last_answer = DailyAnswer.objects.filter(
                profile=profile
            ).latest('created_at')
        
        except DailyAnswer.DoesNotExist:
            # return first daily question
            return DailyQuestion.objects.first()
        
        except Exception as e:
            raise CustomException(
                f"got unexpected error while getting user last answer: {e}",
                "error",
                status_code=status.HTTP_400_BAD_REQUEST
            )

        # HANDLE: Show new question only if 24 hours have been passed since
        # user's last answer
        current_time = timezone.now()
        if (current_time - user_last_answer.created_at).days < 1:
            raise CustomException(
                "last question was answered less than 24 hours ago",
                "no daily question",
                status_code=status.HTTP_208_ALREADY_REPORTED
            )

        # HANDLE: do not return question which is answered before
        last_answered_question = user_last_answer.question
        
        question = DailyQuestion.objects.filter(
            created_at__gt=last_answered_question.created_at
        ).order_by("created_at").first()
        
        if not question:
            raise CustomException(
                "all the questions were answered",
                "no daily question",
                status_code=status.HTTP_204_NO_CONTENT
            )

        else:
            return question
    
    def get(self, request, *args, **kwargs):
        question = self.get_daily_question(request.user.profile)
        serializer = self.serializer_class(question)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class DailyAnswerView(GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = DailyAnswerSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={"request":request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)