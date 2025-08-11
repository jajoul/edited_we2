from django.core.management.base import BaseCommand
from faker import Faker
from random import choice
from website.models import (DailyAnswer, DailyQuestion, Tag, User,
                            Profile, PersonalDetail, Comment,
                            UserRecommendation, Advertise, Channel, Topic,
                            Tag, Like)

genders = list(range(3))
user_type = list(range(2))

sample_dict = {'key': 'value'}

files_path = 'faker/file1.txt'
image_path = 'faker/image1.png'


class Command(BaseCommand):
    help = 'create 20 data for each model'

    def __init__(self, *args, **kwargs):
        self.faker = Faker()
        super(Command).__init__(*args, **kwargs)

    def add_arguments(self, parser):
        parser.add_argument('num', type=int, help='Number of fake data')        

    def handle(self, *args, **options):
        num = options['num']

        # creating 20 users
        for _ in range(num):
            # Create user
            user = User.objects.create(
                username=self.faker.user_name(),
                email=self.faker.email(),
                which_type=choice(user_type)
            )
            profile = Profile.objects.create(
                user=user,
                first_name=self.faker.first_name(),
                last_name=self.faker.last_name(),
                gender=choice(genders),
            )
            personal_detail = PersonalDetail.objects.create(
                profile=profile,
                favorites=self.faker.text(),
                difficulties=self.faker.text(),
                experiences=self.faker.text(),
                about=self.faker.text(),
            )

            # Question, answer and tags
            question = DailyQuestion.objects.create(content=self.faker.sentence())
            answer = DailyAnswer.objects.create(question=question, content=self.faker.sentence())
            tag1 = Tag.objects.create(name=self.faker.word())
            tag2 = Tag.objects.create(name=self.faker.word())
            answer.tags.add(tag1)
            answer.tags.add(tag2)

            # UserRecommendations
            inter = UserRecommendation.objects.create(
                profile=profile,
                tags=sample_dict,
                answers=sample_dict,
            )

            # Advertise
            ad = Advertise()
            ad.image = image_path
            ad.save()

            # Channels
            channel = Channel.objects.create(
                image=image_path,
                title=self.faker.word(),
                about=self.faker.text(),
                which_type=choice(user_type)
            )
            channel.members.add(profile)

            # Tag
            tag = Tag.objects.create(name=self.faker.word())

            # Topic
            topic = Topic.objects.create(
                name=self.faker.word(),
                description=self.faker.text(),
                location=self.faker.url(),
                video=files_path,
                picture=image_path,
                pdf=files_path,
                which_type=choice(user_type),
                channel=channel
            )
            topic.tags.add(tag)

            # Like
            like = Like.objects.create(
                profile=profile,
                topic=topic,
            )

            # Comment
            comment = Comment.objects.create(
                score=self.faker.random_int(min=0, max=10),
                content=self.faker.text(),
                topic=topic,
            )


