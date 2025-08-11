from django.db import models
from website.models import BaseModel

def get_default_json_tags():
    return {
        "detail": []
    }

class DailyQuestion(BaseModel):
    """
    Daily questions have one statement, and must include 4 answers
    which each of these answers can contain several tags and each tag
    must have a score in the following format:
    opt1_tags = ["tag1": 2.3, "tag5":1.1]
    these tags will update the user's UserRecommendation.tags attribute
    and we can use these to update recommendations for user
    """
    # Data
    ques_statement = models.CharField(max_length=500)
    
    # OPTION 1 details:
    opt1_statement = models.CharField(max_length=500, null=False, blank=False)
    opt1_tags = models.JSONField(default=get_default_json_tags)
    
    # OPTION 2 details:
    opt2_statement = models.CharField(max_length=500, null=False, blank=False)
    opt2_tags = models.JSONField(default=get_default_json_tags)
    
    # OPTION 3 details:
    opt3_statement = models.CharField(max_length=500, null=False, blank=False)
    opt3_tags = models.JSONField(default=get_default_json_tags)
    
    # OPTION 4 details:
    opt4_statement = models.CharField(max_length=500, null=False, blank=False)
    opt4_tags = models.JSONField(default=get_default_json_tags)
    
    def __str__(self):
        return f"DailyQuestion obj: {self.id}-{self.ques_statement}"


class DailyAnswer(BaseModel):
    """
    after each answer that a user gives to a DailyQuestion obj, a DailyAnswer
    object will be created which stores that question by foreign key, given answer
    as a charfield and applied tags which is related to the selected option.
    """
    # Relations
    question = models.ForeignKey('website.DailyQuestion', related_name='answers', on_delete=models.DO_NOTHING)
    profile = models.ForeignKey('website.Profile', related_name='answers', on_delete=models.DO_NOTHING)

    # Data
    content = models.CharField(max_length=250)
    applied_tags = models.JSONField(default=get_default_json_tags)

    def __str__(self):
        return f"DailyAnswer obj: {self.id}-{self.question}"
    

PROFILE_ANSWER_MODE_OPTIONS = [
    ("4_opt","4_opt"),
    ("2_opt","2_opt"),
    ("text","text"),
]


class ProfileQuestion(BaseModel):
    """
    Profile questions have one statement, and can have 3 different
    format as an answer
    
    format 1: 4 option answer, must include 4 answers
    
    format 2: 2 option answer, this mode can only read opt1_statement and opt2_statement
    and ignored opt3 and 4
    
    format 3: text as an answer, this mode will ignore all the opt statements
    
    these tags will (NOT) update the user's UserRecommendation.tags attribute
    """
    # Data
    mode = models.CharField(max_length=10, choices=PROFILE_ANSWER_MODE_OPTIONS)
    ques_statement = models.CharField(max_length=500, null=False, blank=False)
    
    # OPTIONs:
    opt1_statement = models.CharField(max_length=500, null=True, blank=True)
    opt2_statement = models.CharField(max_length=500, null=True, blank=True)
    opt3_statement = models.CharField(max_length=500, null=True, blank=True)
    opt4_statement = models.CharField(max_length=500, null=True, blank=True)
    
    def __str__(self):
        return f"ProfileQuestion obj: {self.id}-{self.mode}-{self.ques_statement}"
    
    
class ProfileAnswer(BaseModel):
    """
    after each answer that a user gives to a ProfileQuestion obj, a ProfileAnswer
    object will be created which stores that question by foreign key, given answer
    as a charfield and applied tags which is related to the selected option.
    """
    # Relations
    question = models.ForeignKey('website.ProfileQuestion', related_name='profile_answers', on_delete=models.DO_NOTHING)
    profile = models.ForeignKey('website.Profile', related_name='profile_answers', on_delete=models.DO_NOTHING)

    # Data
    content = models.CharField(max_length=250)
    mode = models.CharField(max_length=10, choices=PROFILE_ANSWER_MODE_OPTIONS)

    def __str__(self):
        return f"ProfileAnswer obj: {self.id}-{self.question}"    
    