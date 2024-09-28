from django.urls import path
from .views import HomeAPIView, LoginAPIView, OAuthCallbackAPIView, LogoutAPIView

app_name = 'myauth'
urlpatterns = [
    path('api/home/', HomeAPIView.as_view(), name='home'),
    path('api/login/', LoginAPIView.as_view(), name='login'),
    path('oauth/callback/', OAuthCallbackAPIView.as_view(), name='oauth_callback'),
    path('api/logout/', LogoutAPIView.as_view(), name='logout'),
]