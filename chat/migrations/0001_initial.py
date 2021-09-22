# Generated by Django 3.2.6 on 2021-09-03 23:47

import chat.models
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('server', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Message',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('body', models.TextField(blank=True, max_length='1500', null=True)),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('file', models.FileField(blank=True, null=True, upload_to=chat.models.user_directory_path)),
                ('is_read', models.BooleanField(default=False)),
                ('channel', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='msg_channel', to='server.textchannels')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='server_msg_user', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
