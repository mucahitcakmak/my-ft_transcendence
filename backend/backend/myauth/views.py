from users.models import User, Profile
from rest_framework.authentication import TokenAuthentication
import os
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import requests
from django.shortcuts import redirect


class HomeAPIView(APIView):
    authentication_classes = [TokenAuthentication]

    def get(self, request):
        user = request.user
        return Response({
            'is_authenticated': True,
            'user': {
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'profile_picture': user.profile.profile_picture,
                'is_active': user.is_active,
            }
        })

class LoginAPIView(APIView):
    def get(self, request):
        print(os.getenv('OAUTH_TOKEN_URL'))
        print("LoginAPIView")
        oauth_url = "https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-2e5eba2c721f7473062fea122d61d87599c2853a255e98a4fb42c31327a698ea&redirect_uri=http%3A%2F%2F127.0.0.1%3A8000%2Foauth%2Fcallback%2F&response_type=code"
        return Response({'redirect_url': oauth_url}, status=status.HTTP_200_OK)


class OAuthCallbackAPIView(APIView):
    def get(self, request):
        code = request.GET.get('code')
        if code:
            token_url = os.getenv('OAUTH_TOKEN_URL')
            data = {
                'grant_type': 'authorization_code',
                'client_id': os.getenv('OAUTH_CLIENT_ID'),
                'client_secret': os.getenv('OAUTH_CLIENT_SECRET'),
                'code': code,
                'redirect_uri': os.getenv('OAUTH_REDIRECT_URI'),
            }
            response = requests.post(token_url, data=data)
            token_data = response.json()

            access_token = token_data.get('access_token')
            if access_token:
                return self.save_user_data(request, access_token)
            return Response({'error': 'Access token retrieval failed'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'error': 'Authorization failed'}, status=status.HTTP_400_BAD_REQUEST)

    def save_user_data(self, request, access_token):
        headers = {'Authorization': f'Bearer {access_token}'}
        user_info_url = "https://api.intra.42.fr/v2/me"
        response = requests.get(user_info_url, headers=headers)
        user_data = response.json()

        user, created = User.objects.get_or_create(
            email=user_data.get('email'),
            defaults={
                'username': user_data.get('login'),
                'first_name': user_data.get('first_name', ''),
                'last_name': user_data.get('last_name', ''),
            }
        )

        learner_cursus = next(
            (cursus for cursus in user_data.get('cursus_users', []) if cursus.get('grade') == "Learner"),
            None
        )
        Profile.objects.update_or_create(
            user=user,
            defaults={
                'profile_picture': user_data.get('image', '').get('link', ''),
                'level': learner_cursus.get('level', 1) if learner_cursus else 1,
                'grade': learner_cursus.get('grade', '') if learner_cursus else '',
                'campus': user_data.get('campus')[0].get('name', '') if user_data.get('campus') else '',
            }
        )

        token, created = Token.objects.get_or_create(user=user)

        return redirect(f'http://127.0.0.1:80/home?token={token.key}')


class LogoutAPIView(APIView):
    authentication_classes = [TokenAuthentication]

    def post(self, request):
        request.user.auth_token.delete()
        return Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)

