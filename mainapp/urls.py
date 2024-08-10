from django.urls import path
from . import views
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
	path("", views.LoginPage, name="LoginPage"),
	path("mainpage", views.MainPage, name="MainPage"),
	path("auth", views.Auth,name="auth")
	
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)