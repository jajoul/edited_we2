from rest_framework import serializers, status
from website.tools.exceptions import CustomException
from website.models import (
    DailyQuestion, DailyAnswer, UserRecommendation
)


class DailyQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyQuestion
        exclude = ['opt1_tags', 'opt2_tags', 'opt3_tags', 'opt4_tags', 'created_at', 'updated_at']


class DailyAnswerSerializer(serializers.ModelSerializer):
    question_id = serializers.IntegerField(required=True)
    which_option = serializers.IntegerField(required=True)
    class Meta:
        model = DailyAnswer
        fields = ['content', 'question_id', 'which_option']

    def create(self, validated_data):
        user_profile = self.context['request'].user.profile
        
        # Check if the selected question exists
        try:
            question = DailyQuestion.objects.get(id=validated_data['question_id'])
        except Exception as e:
            raise CustomException(
                f"failed to find your selected question: {e}",
                "error",
                status_code=status.HTTP_404_NOT_FOUND
            )

        # which option of the question is selected as answer,
        # find it and grab the opt_tags information
        if validated_data['which_option'] == 1:
            tags = question.opt1_tags
        elif validated_data['which_option'] == 2:
            tags = question.opt2_tags
        elif validated_data['which_option'] == 3:
            tags = question.opt3_tags
        elif validated_data['which_option'] == 4:
            tags = question.opt4_tags
        else:    
            raise CustomException(
                "error",
                "selected option is not available",
                status_code=status.HTTP_404_NOT_FOUND
            )
        
        # STEP1: Create daily answer instance
        try:
            answer = DailyAnswer.objects.create(
                question = question,
                profile = user_profile,
                content = validated_data['content'],
                applied_tags = tags['detail']
            )
        except Exception as e:
            raise CustomException(
                f"failed to create DailyAnswer: {e}",
                "error",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        # STEP2: Update UserRecommendation
        try:
            user_recommendation = UserRecommendation.objects.get(
                profile = user_profile
            )
            user_tags = user_recommendation.tags
        except UserRecommendation.DoesNotExist:
            raise CustomException(
                "failed to find user recommendation object",
                "error",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        except Exception as e:
            raise CustomException(
                f"{e}",
                "error",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # question tag key and value
        # for q_tag_k, q_tag_v in tags['detail']:
        for tag in tags['detail']:
            q_tag_k, q_tag_v = next(iter(tag.items()))

            # this tag already exists in user tags
            if q_tag_k in user_tags:
                # update its value
                user_tags[q_tag_k] = user_tags[q_tag_k] + q_tag_v
            
            # we have to create this key for the first time
            else:
                user_tags[q_tag_k] = q_tag_v

        user_recommendation.save()
        return answer

    def to_representation(self, instance):
        return {"status": "done"}