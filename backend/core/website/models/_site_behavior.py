from website.models import BaseModel, UserTypes
from django.db import models
from website.validators import file_size_validator


class Tag(BaseModel):
    """
    Tags for recognizing user's interaction stored as this model
    """
    # Data
    name = models.CharField(max_length=50)

    def __str__(self):
        return f"Tag obj: {self.id}-{self.name}"
    

class Topic(BaseModel):
    """
    Not Sure...
    """
    # Relations
    tags = models.ManyToManyField('website.Tag')
    channel = models.ForeignKey('website.Channel', on_delete=models.CASCADE, related_name='topics')

    # Data
    name = models.CharField(max_length=50)
    description = models.TextField()
    location = models.URLField(null=True, blank=True)
    video = models.FileField(null=True, blank=True, validators=[file_size_validator.validate_file_size])
    picture = models.ImageField(upload_to='images/topics/', null=True, blank=True)
    pdf = models.FileField(null=True, blank=True)
    which_type = models.IntegerField(choices=UserTypes.choices, default=UserTypes.COMMON.value)
    likes_count = models.BigIntegerField(default=0)
    comments_count = models.BigIntegerField(default=0)

    def __str__(self):
        return f"Topic obj: {self.id}-{self.channel}-{self.name}"


class Advertise(BaseModel):
    """
    Admin can add some advertisements which will be displayed on the
    site, in this model we will their data
    """
    # Data
    image = models.ImageField(upload_to='images/advertisement/')
    url = models.URLField()

    def __str__(self):
        return f"Advertise obj: {self.id}-{self.url}"
    

class Channel(BaseModel):
    """
    Channels data stored as this model
    """
    # Relations
    creator = models.ForeignKey('website.Profile', related_name='creator', on_delete=models.DO_NOTHING)
    members = models.ManyToManyField('website.Profile', related_name='followed_channels')
    
    # Data
    image = models.ImageField(upload_to='images/channels/')
    title = models.CharField(max_length=100)
    about = models.TextField()
    which_type = models.IntegerField(choices=UserTypes.choices, default=UserTypes.COMMON.value)
    
    def __str__(self):
        return f"Channel obj: {self.id}-{self.title}-{self.which_type}"


class Like(BaseModel):
    """
    User's like 
    """
    # Relations
    profile = models.ForeignKey('website.Profile', related_name='likes', on_delete=models.CASCADE)
    topic = models.ForeignKey('website.Topic', related_name='likes', on_delete=models.CASCADE)

    def __str__(self):
        return f"Like obj: {self.id}-{self.profile}-{self.topic}"
    

class Comment(BaseModel):
    """
    User's comments
    """
    # Relations
    comment = models.ForeignKey('website.Comment', related_name='replies', on_delete=models.CASCADE, null=True, blank=True)
    topic = models.ForeignKey('website.Topic', related_name='comments', on_delete=models.CASCADE, null=False, blank=False)
    profile = models.ForeignKey('website.Profile', related_name='comments', on_delete=models.CASCADE, null=False, blank=False)

    # Data
    score = models.IntegerField()
    content = models.TextField()

    def __str__(self):
        return f"Comment obj: {self.id}-{self.comment}-{self.topic}"
