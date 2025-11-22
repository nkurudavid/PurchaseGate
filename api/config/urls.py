from django.contrib import admin
from django.urls import path, include
from django.shortcuts import render

# Home view for the index page
def home(request):
    return render(request, 'index.html')


urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('apps.auth.urls')),
    path('purchases/', include('apps.purchases.urls')),
    path('', home, name='home'),
]