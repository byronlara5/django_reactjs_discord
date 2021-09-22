from django.urls import path
from server import api

urlpatterns = [
    path('server/getservers/', api.ServerAPI.as_view(), name='api-get-servers'),
    path('server/createserver/', api.ServerAPI.as_view(), name='api-create-server'),
    path('server/getserverdetail/<uuid:pk>', api.ServerDetailAPI, name='api-get-server-detail'),
    path('server/getcategories/', api.ServerCategoriesAPI, name='api-get-server-categories'),
    path('server/getserverscategory/<int:pk>', api.ServersInCategoryAPI.as_view(), name='api-get-servers-in-category'),
    path('server/searchserver/', api.ServerSearch.as_view(), name='api-search-server'),
    path('server/create-category-channel', api.CategoryChannelsCreate, name='api-create-category-channel'),
    path('server/create-text-channel', api.TextChannelsCreate, name='api-create-text-channel'),
    path('server/ban/<int:pk>/<uuid:server_id>', api.banAPI, name='api-ban-user'),
    path('server/leaveserver/<uuid:pk>', api.LeaveServerAPI, name='api-leave-server'),
]