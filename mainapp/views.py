from django.shortcuts import render, redirect
from django.conf import settings
from django.http import JsonResponse
import requests

def LoginPage(request):
    return render(request, "mainapp/login.html")

def MainPage(request):
    return render(request, "mainapp/mainpage.html")