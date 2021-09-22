from django.db import models
from django.contrib.auth.models import User
from server.models import TextChannels

# Create your models here.
def user_directory_path(instance, filename):
    #This file will be uploadded to MEDIA /user_(id)/the file
    return 'user_{0}/{1}'.format(instance.user.id, filename)

class Message(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="server_msg_user")
    body = models.TextField(max_length=1500, blank=True, null=True)
    date = models.DateTimeField(auto_now_add=True)
    file = models.FileField(upload_to=user_directory_path, blank=True, null=True)
    channel = models.ForeignKey(TextChannels, on_delete=models.CASCADE, related_name='msg_channel')
    is_read = models.BooleanField(default=False)
