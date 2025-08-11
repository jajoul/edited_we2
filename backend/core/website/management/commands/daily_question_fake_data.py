from django.core.management.base import BaseCommand
from faker import Faker
from website.models import (
    Tag, DailyQuestion
)
from random import choice, randint, uniform


class Command(BaseCommand):
    help = 'creates tags, daily questions and daily answers as much as needed.'

    def __init__(self, *args, **kwargs):
        self.faker = Faker()
        super(Command).__init__(*args, **kwargs)    

    def generate_random_opt_tags(self, tags_num):
        data = []
        tags = Tag.objects.all()
        for i in range(randint(1, tags_num)):
            
            # prevent from duplicated tags
            random_tag = choice(tags)
            tags = tags.exclude(id=random_tag.id)

            data.append({f'{random_tag.id}': round(uniform(0.5, 4.5), 2)})
        return data

    def handle(self, *args, **options):
        tags_num = int(input("How many daily tags is required? "))
        question_num = int(input("How many daily question is required? "))
        ans_num = int(input("How many answers are required(for each question)? "))

        # tags creation
        for i in range(tags_num):
            tag = Tag.objects.create(
                name = f"tag {i}"
            )
            print(f"{i+1}-{tag} Successfully created")
        
        # questions creation
        for i in range(question_num):
            
            # create opt_tags
            opt_tags = []
            for j in range(4):
                opt_tags.append({
                    "detail": self.generate_random_opt_tags(tags_num)
                })

            ques = DailyQuestion.objects.create(
                ques_statement = f"This is a question number {i}",
                opt1_statement = f"This is a option 1 answer of the question number {i}",
                opt1_tags = opt_tags[0],
                opt2_statement = f"This is a option 2 answer of the question number {i}",
                opt2_tags = opt_tags[1],
                opt3_statement = f"This is a option 3 answer of the question number {i}",
                opt3_tags = opt_tags[2],
                opt4_statement = f"This is a option 4 answer of the question number {i}",
                opt4_tags = opt_tags[3],
            )
            print(f"{i+1}-{ques} Successfully created")

        # TODO: ADD DAILY ANSWER