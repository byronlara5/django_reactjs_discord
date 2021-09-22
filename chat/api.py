from server.models import TextChannels, Server
from chat.models import Message
from chat.serializers import ChatSerializer

#Pagination Stuff
from rest_framework.pagination import PageNumberPagination

#Django REst
from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes

#Django Stuff
from django.http.response import Http404

#Response Pagination UTIL:
class ResponsePagination(PageNumberPagination):
    page_query_param = 'p'
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 5

class chatAPIList(APIView):
    permission_classes = [permissions.IsAuthenticated,]

    def get_object(self, pk):
        try:
            return TextChannels.objects.get(pk=pk)
        except TextChannels.DoesNotExist:
            raise Http404
    
    def get(self, request, pk, format=None):
        channel = self.get_object(pk)
        messages = Message.objects.filter(channel=channel).order_by('-date')
        #For pagination
        paginator = ResponsePagination()
        results = paginator.paginate_queryset(messages, request)
        serializer = ChatSerializer(results, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)
    
    def post(self, request, format=None):
        serializer = ChatSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save(user=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_4OO_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated,])
def DeleteMessageAPI(request, pk, server_id):
    if request.method == 'DELETE':
        server = Server.objects.get(pk=server_id)
        if request.user in server.moderators.all() or request.user == server.user:
            Message.objects.get(pk=pk).delete()
            return Response(status=status.HTTP_202_ACCEPTED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)