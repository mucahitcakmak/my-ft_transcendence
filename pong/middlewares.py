from django.http import HttpResponse
from django.template import loader

class SPAFallbackMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        # Eğer response 404 ise ve accept header "text/html" içeriyorsa
        if response.status_code == 404 and "text/html" in request.headers.get("Accept", ""):
            # Ana template dosyasını yükle ve return et
            template = loader.get_template('mainpage.html')
            return HttpResponse(template.render({}, request))
        return response