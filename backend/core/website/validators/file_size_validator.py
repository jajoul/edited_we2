from django.db import models
from django.core.exceptions import ValidationError


def validate_file_size(value):
    filesize = value.size
    if filesize > (100 * 1024 * 1024):  # 10 MB in bytes
        raise ValidationError(
            "The maximum file size that can be uploaded is 100 MB"
        )