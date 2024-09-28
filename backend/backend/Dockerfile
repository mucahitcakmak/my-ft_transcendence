# Base image olarak Python kullanılıyor
FROM python:3.12.6

# Çalışma dizinini oluştur ve ayarla
WORKDIR /code

# Gereksinim dosyasını ekle ve yükle
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV DJANGO_SETTINGS_MODULE=backend.settings
ENV PYTHONUNBUFFERED=1

# Port aç
EXPOSE 8000

# Django sunucusunu çalıştır
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
