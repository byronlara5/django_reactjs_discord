from django.db import models
from django.contrib.auth.models import User

import uuid
import os
from django.conf import settings
# Create your models here.


class ServerCategory(models.Model):
    title = models.CharField(max_length=25)
    icon = models.CharField(max_length=25)
    
    def __str__(self):
        return self.title

def server_directory_path_banner(instance, filename):
    # file will be uploaded to MEDIA_ROOT/user_<id>/<filename>
    banner_pic_name = 'user_{0}/server_{1}/banner.jpg'.format(instance.user.id, instance.id)
    full_path = os.path.join(settings.MEDIA_ROOT, banner_pic_name)

    if os.path.exists(full_path):
    	os.remove(full_path)
    return banner_pic_name

def server_directory_path_picture(instance, filename):
    # file will be uploaded to MEDIA_ROOT/user_<id>/<filename>
    picture_pic_name = 'user_{0}/server_{1}/picture.jpg'.format(instance.user.id, instance.id)
    full_path = os.path.join(settings.MEDIA_ROOT, picture_pic_name)

    if os.path.exists(full_path):
    	os.remove(full_path)
    return picture_pic_name

class TextChannels(models.Model):
    title = models.CharField(max_length=25)
    topic = models.CharField(max_length=50)

    def __str__(self):
        return self.title

class Category(models.Model):
    title = models.CharField(max_length=25)
    text_channels = models.ManyToManyField(TextChannels)
    
    def __str__(self):
        return self.title

class Server(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    picture = models.ImageField(upload_to=server_directory_path_picture, null=False)
    banner = models.ImageField(upload_to=server_directory_path_banner, null=False)
    title = models.CharField(max_length=25)
    description = models.CharField(max_length=144, null=False)
    date = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='server_owner')
    members = models.ManyToManyField(User, related_name='server_members')
    moderators = models.ManyToManyField(User, related_name='server_moderators')
    categories = models.ManyToManyField(Category)
    server_category = models.ForeignKey(ServerCategory, on_delete=models.CASCADE, null=True)
    
    def __str__(self):
        return self.title