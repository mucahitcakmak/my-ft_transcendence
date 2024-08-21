from django.urls import path, re_path
from . import views
from django.conf.urls.static import static
from django.conf import settings
from django.views.generic import TemplateView

urlpatterns = [
	path("", views.MainPage, name="MainPage"),
	
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)