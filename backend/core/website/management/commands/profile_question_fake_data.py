from django.core.management.base import BaseCommand
from faker import Faker
from website.models import (
    Tag, ProfileQuestion
)
from random import choice, randint, uniform


class Command(BaseCommand):
    help = 'creates profile question in 3 modes'

    def __init__(self, *args, **kwargs):
        self.faker = Faker()
        super(Command).__init__(*args, **kwargs)    

    def generate_random_opt_tags(self):
        data = []
        tags = Tag.objects.all()
        
        for i in range(randint(1, 4)):    
            # prevent from duplicated tags
            random_tag = choice(tags)
            tags = tags.exclude(id=random_tag.id)
            data.append({f'{random_tag.id}': round(uniform(0.5, 4.5), 2)})
        
        return data

    def handle(self, *args, **options):
        # tags creation
        for i in range(4):
            tag = Tag.objects.create(
                name = f"tag {i}"
            )
            print(f"{i+1}-{tag} Successfully created")
        
        # questions creation
        for mode in ["4_opt", "2_opt", "text"]:
            for i in range(2):
                
                # create opt_tags
                opt_tags = []
                for j in range(4):
                    opt_tags.append({
                        "detail": self.generate_random_opt_tags()
                    })

                ques = ProfileQuestion.objects.create(
                    mode=mode,
                    ques_statement = f"This is a profile question number {i}",
                    opt1_statement = f"This is a profile option 1 answer of the question number {i}",
                    opt2_statement = f"This is a profile option 2 answer of the question number {i}",
                    opt3_statement = f"This is a profile option 3 answer of the question number {i}",
                    opt4_statement = f"This is a profile option 4 answer of the question number {i}",
                )
                print(f"{i+1}-{ques} Successfully created")

        # TODO: ADD DAILY ANSWER