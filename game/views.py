from django.shortcuts import render
import requests

def MainPage(request):
    return render(request, "mainpage.html")