from django.contrib import admin
from website.models import (
    Topic, Tag, Comment, Channel, Advertise
)


class TagAdmin(admin.ModelAdmin):
    ...
admin.site.register(Tag, TagAdmin)


class TopicAdmin(admin.ModelAdmin):
    ...
admin.site.register(Topic, TopicAdmin)


class CommentAdmin(admin.ModelAdmin):
    ...
admin.site.register(Comment, CommentAdmin)


class ChannelAdmin(admin.ModelAdmin):
    ...
admin.site.register(Channel, ChannelAdmin)


class AdvertiseAdmin(admin.ModelAdmin):
    ...
admin.site.register(Advertise, AdvertiseAdmin)