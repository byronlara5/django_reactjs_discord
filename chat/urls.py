from django.urls import path
from chat.api import chatAPIList, DeleteMessageAPI

urlpatterns = [
    path('chat/getchats/<int:pk>', chatAPIList.as_view(), name='api-get-chats'),
    path('chat/sendmessage/', chatAPIList.as_view(), name='api-send-message'),
    path('chat/deletemsg/<int:pk>/<uuid:server_id>', DeleteMessageAPI, name='api-del-message'),
]