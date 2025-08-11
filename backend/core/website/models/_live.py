from django.db import models
from website.models import BaseModel
from django.core.validators import MaxLengthValidator
from time import time


class LiveStatusChoice(models.IntegerChoices):
    INIT = 0, 'Initial'
    ONLINE = 1, 'Online'
    ENDED = 2, 'Ended'
    PLAYBACK = 3, 'Playback'
    SCHEDULED = 4, 'Scheduled'


class Live(BaseModel):
    title = models.CharField(max_length=50, validators=[MaxLengthValidator(50)])
    description = models.TextField(default="")
    user = models.ForeignKey('website.User', on_delete=models.CASCADE, related_name='lives')
    status = models.SmallIntegerField(choices=LiveStatusChoice.choices, default=LiveStatusChoice.INIT.value)
    room_id = models.CharField(max_length=50, null=True, blank=True)
    date = models.DateField(blank=True, null=True)
    cover = models.ImageField(upload_to="live_covers/", blank=True, null=True)
    created_date = models.DateTimeField(auto_now_add=True)
    url=models.URLField(blank=True, null=True)
    video = models.FileField(upload_to="playbacks/", null=True, blank=True)
    members_count = models.IntegerField(default=0)

    def __str__(self) -> str:
        return f"{self.id}-{self.user.username}-{self.status}"

    def save(self, *args, **kwargs) -> None:

        # Generate room_id
        if not self.room_id:
            self.room_id = f"{self.user.username}-{int(time())}{self.user.lives.count()+1}"

        return super().save(*args, **kwargs)