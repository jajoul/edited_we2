from django.db import models
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from website.models import (
    Profile, Like, Comment, BaseModel
)


LAST_ACTIVITIES_CHOICES = [
    ("like","like"),
    ("comment","comment"),
]

class LastActivities(BaseModel):
    """
    this table will store all of the data related to user topic
    example: if any other user like or comment on your topic
    history of these actions will be stored here
    note: is_seen field means that user checked this history or not
    if get method gets called on a history that has not been showed
    before, is_seen bool will be false, but after the first visit,
    its get true
    """
    # Relations
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name="last_activities")
    like = models.ForeignKey(
        Like, 
        on_delete=models.CASCADE, 
        related_name="last_activities",
        null=True,
        blank=True
    )
    comment = models.ForeignKey(
        Comment, 
        on_delete=models.CASCADE, 
        related_name="last_activities",
        null=True,
        blank=True
    )
    
    # Data
    is_seen = models.BooleanField(default=False)
    type = models.CharField(max_length=10, choices=LAST_ACTIVITIES_CHOICES, null=False, blank=False)
    
    def __str__(self):
        return f"LastActivities obj: {self.id}-{self.type}-{self.profile}"
    

# update comment notification on last activities table
# NOTE: there is no need for DELETE signal, due to on_delete method on last activity model
@receiver(
    post_save, 
    sender=Comment, 
    dispatch_uid="add_comment_notification_to_last_activities"
)
def add_comment_notification(sender, instance, created, **kwargs):
    if created:
        activity_owner_profile = instance.topic.channel.creator
        LastActivities.objects.create(
            profile=activity_owner_profile,
            comment=instance,
            type="comment"
        )


# update like notification on last activities table
# NOTE: there is no need for DELETE signal, due to on_delete method on last activity model
@receiver(
    post_save, 
    sender=Like, 
    dispatch_uid="add_like_notification_to_last_activities"
)
def add_like_notification(sender, instance, created, **kwargs):
    if created:
        activity_owner_profile = instance.topic.channel.creator
        LastActivities.objects.create(
            profile=activity_owner_profile,
            like=instance,
            type="like"
        )
        
