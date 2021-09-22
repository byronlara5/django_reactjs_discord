from rest_framework import serializers
from chat.models import Message
from authy.serializers import UserSerializer

class ChatSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = Message
        fields = '__all__'