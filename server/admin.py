from django.contrib import admin
from server.models import ServerCategory, Server, Category, TextChannels

# Register your models here.
admin.site.register(ServerCategory)
admin.site.register(Server)

admin.site.register(Category)
admin.site.register(TextChannels)