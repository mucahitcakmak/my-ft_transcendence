from django.shortcuts import render, redirect
from django.conf import settings
from django.http import JsonResponse
import requests

def LoginPage(request):
    return render(request, "mainapp/login.html")

def MainPage(request):
    return render(request, "mainapp/mainpage.html")

def Auth(request):
    client_id = settings.AUTHLIB_OAUTH_CLIENTS['42api']['client_id']
    redirect_uri = settings.AUTHLIB_OAUTH_CLIENTS['42api']['redirect_uri']
    authorize_url = settings.AUTHLIB_OAUTH_CLIENTS['42api']['authorize_url']
    
    auth_url = f"{authorize_url}?client_id={client_id}&redirect_uri={redirect_uri}&response_type=code"
    return redirect(auth_url)

def authorize(request):
    code = request.GET.get('code')
    
    if not code:
        return JsonResponse({'error': 'Code not provided'}, status=400)
    
    token_url = settings.AUTHLIB_OAUTH_CLIENTS['42api']['access_token_url']
    client_id = settings.AUTHLIB_OAUTH_CLIENTS['42api']['client_id']
    client_secret = settings.AUTHLIB_OAUTH_CLIENTS['42api']['client_secret']
    redirect_uri = settings.AUTHLIB_OAUTH_CLIENTS['42api']['redirect_uri']
    
    # Access token almak için POST isteği gönder
    token_response = requests.post(token_url, data={
        'grant_type': 'authorization_code',
        'client_id': client_id,
        'client_secret': client_secret,
        'code': code,
        'redirect_uri': redirect_uri
    })

    token_data = token_response.json()
    
    if 'access_token' not in token_data:
        return JsonResponse({'error': 'Failed to obtain access token'}, status=400)
    
    access_token = token_data['access_token']
    
    # Access token ile kullanıcı bilgilerini almak için API'yi çağır
    userinfo_endpoint = settings.AUTHLIB_OAUTH_CLIENTS['42api']['userinfo_endpoint']
    user_info_response = requests.get(userinfo_endpoint, headers={
        'Authorization': f'Bearer {access_token}'
    })
    
    user_info = user_info_response.json()
    
    # Kullanıcı bilgileri ile kimlik doğrulama işlemi yapabilir, veritabanına kaydedebilir, oturum açabilirsiniz.
    
    # Bu örnek için kullanıcı bilgilerini JSON olarak döndürüyoruz
    return JsonResponse(user_info)