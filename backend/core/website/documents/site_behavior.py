from django_elasticsearch_dsl import Document, fields
from django_elasticsearch_dsl.registries import registry
from website.models import Channel, Topic


@registry.register_document
class ChannelDocument(Document):
    class Index:
        name = 'channel'
        settings = {'number_of_shards': 1, 'number_of_replicas':0}
    
    class Django:
        model = Channel
        fields = ['title', 'image', 'which_type']


@registry.register_document
class TopicDocument(Document):
    channel_image = fields.TextField()

    class Index:
        name = 'topic'
        settings = {'number_of_shards': 1, 'number_of_replicas':0}
    
    class Django:
        model = Topic
        fields = ['name', 'updated_at', 'comments_count', 'likes_count', 'which_type']
    
    def prepare_channel_image(self, instance):
        return instance.channel.image.url