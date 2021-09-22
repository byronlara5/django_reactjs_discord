#Django User
from django.contrib.auth import login

#Authy app
from authy.serializers import SignupSerializer, UserSerializer

#Knox app
from knox.models import AuthToken
from knox.views import LoginView as KnoxLoginView

#Django REst
from rest_framework import permissions, generics
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.authtoken.serializers import AuthTokenSerializer

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def SignupAPI(request):
    if request.method == 'POST':
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            created, token = AuthToken.objects.create(user)
            return Response({
                'user': serializer.data,
                'status': status.HTTP_201_CREATED,
                'token': token
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginAPI(KnoxLoginView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = AuthTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)
        return super(LoginAPI, self).post(request, format=None)

class UserAPI(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated,]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user
