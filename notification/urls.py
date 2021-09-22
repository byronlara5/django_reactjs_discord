from django.urls import path
from notification import api

urlpatterns = [
    path('notification/getnotifications/', api.NotificationAPI.as_view(), name='api-get-notifications'),
    path('notification/createinvitation/', api.NotificationAPI.as_view(), name='api-create-invitation'),
    path('notification/deletenotification/<int:pk>', api.NotificationAPI.as_view(), name='api-delete-notification'),
    path('notification/invitation/<int:pk>', api.acceptInvitation, name='api-accept-invitation'),
    path('notification/invitation/request/', api.ReqToJoinServer, name='api-req-to-join'),
]