from django.db import models

class TosDocument(models.Model):
    text = models.TextField()
    bullets = models.JSONField(null=True)
