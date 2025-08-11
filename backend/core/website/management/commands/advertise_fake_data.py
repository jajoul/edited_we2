from faker import Faker
from django.core.management.base import BaseCommand
from random import randint
from website.models import (
    Advertise
)


class Command(BaseCommand):
    help = 'creates random advertisements'

    def __init__(self, *args, **kwargs):
        self.ads = [
            {
                "image": '/faker/alibaba.jpeg',
                "url": "https://alibaba.ir"
            },
            {
                "image": '/faker/aparat.png',
                "url": "https://aparat.com"
            },
            {
                "image": '/faker/digikala.png',
                "url": "https://digikala.com"
            },
            {
                "image": '/faker/divar.png',
                "url": "https://divar.ir"
            },
            {
                "image": '/faker/hamravesh.png',
                "url": "https://hamravesh.com"
            },
            {
                "image": '/faker/jobinja.png',
                "url": "https://jobinja.ir"
            },
            {
                "image": '/faker/maktabkhone.png',
                "url": "https://maktabkhooneh.ir/"
            },
            {
                "image": '/faker/mofid.png',
                "url": "https://www.emofid.com/"
            },
            {
                "image": '/faker/snapp.png',
                "url": "https://www.snapp.ir/"
            },
            {
                "image": '/faker/snappfood.png',
                "url": "https://www.snappfood.ir/"
            },
            {
                "image": '/faker/torob.png',
                "url": "https://www.torob.com"
            },
        ]
        self.faker = Faker()
        super(Command).__init__(*args, **kwargs)    

    def handle(self, *args, **options):
        ads_num = int(input("How many advertisements is required? "))
        
        for i in range(ads_num):
            ad = self.ads[randint(0,10)]
            ad_obj = Advertise.objects.create(
                image = ad["image"],
                url = ad["url"]
            )
            print(f"{i}-{ad_obj} successfully created")