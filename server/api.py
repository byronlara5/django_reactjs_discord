from server.models import Server, ServerCategory, TextChannels, Category
from server.serializers import ServerCategorySerializer, ServerTextChannelSerializer, ServerChannelCategories, ServerSerializer, ServerDetailSerializer
from django.db.models import Q
from django.contrib.auth.models import User

#Django REst
from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, JSONParser
from django.http.response import Http404
from rest_framework.pagination import PageNumberPagination

#For the Server Search
from rest_framework import generics
from rest_framework import filters


#Response Pagination UTIL:
class ResponsePagination(PageNumberPagination):
    page_query_param = 'p'
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 10

class ServerAPI(APIView):
    permission_classes = [permissions.IsAuthenticated,]
    parser_classes = [MultiPartParser,]
    
    def get_object(self, pk):
        try:
            return ServerCategory.objects.get(pk=pk)
        except ServerCategory.DoesNotExist:
            raise Http404

    def get(self, request, format=None):
        servers = Server.objects.filter(Q(members=request.user) | Q(user=request.user)).distinct()
        serializer = ServerSerializer(servers, many=True)
        return Response(serializer.data)
    
    def post(self, request, format=None):
        category = self.get_object(request.data['category'])
        serializer = ServerSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save(user=request.user, server_category=category)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated,])
def ServerDetailAPI(request, pk):
    if request.method == 'GET':
        server = Server.objects.get(pk=pk)
        serializer = ServerDetailSerializer(server)
        if request.user in server.moderators.all() or request.user == server.user:
            admin = True
        else:
            admin = False
        return Response({
            'data': serializer.data,
            'is_admin': admin,
        })

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated,])
def ServerCategoriesAPI(request):
    if request.method == 'GET':
        categories = ServerCategory.objects.all()
        serializer = ServerCategorySerializer(categories, many=True)
        return Response(serializer.data)

class ServersInCategoryAPI(APIView):
    permission_classes = [permissions.IsAuthenticated,]

    def get_object(self, pk):
        try:
            return ServerCategory.objects.get(pk=pk)
        except ServerCategory.DoesNotExist:
            raise Http404
    
    def get(self, request, pk, format=None):
        category = self.get_object(pk)
        servers = Server.objects.filter(server_category=category).order_by('-date')
        #For Pagination
        paginator = ResponsePagination()
        results = paginator.paginate_queryset(servers, request)
        serializer = ServerSerializer(results, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)

class ServerSearch(generics.ListAPIView):
    queryset = Server.objects.all()
    serializer_class = ServerSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'description']


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated,])
@parser_classes([JSONParser])
def CategoryChannelsCreate(request):
    if request.method == 'POST':
        server = Server.objects.get(id=request.data['server_id'])
        serializer = ServerChannelCategories(data=request.data)
        if request.user in server.moderators.all() or request.user == server.user:
            if serializer.is_valid(raise_exception=True):
                created = serializer.save()
                server.categories.add(created.id)
                server.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated,])
@parser_classes([JSONParser])
def TextChannelsCreate(request):
    if request.method == 'POST':
        server = Server.objects.get(id=request.data['server_id'])
        category_channel = Category.objects.get(id=request.data['category_id'])
        serializer = ServerTextChannelSerializer(data=request.data)
        if request.user in server.moderators.all() or request.user == server.user:
            if serializer.is_valid(raise_exception=True):
                created = serializer.save()
                category_channel.text_channels.add(created.id)
                category_channel.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated,])
def banAPI(request, pk, server_id):
    if request.method == 'DELETE':
        server = Server.objects.get(pk=server_id)
        user = User.objects.get(pk=pk)
        if request.user in server.moderators.all() or request.user == server.user:
            server.members.remove(user)
            return Response(status=status.HTTP_202_ACCEPTED) 
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated,])
def LeaveServerAPI(request, pk):
    if request.method == 'DELETE':
        server = Server.objects.get(pk=pk)
        server.members.remove(request.user)
        return Response(status=status.HTTP_202_ACCEPTED) 
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)