from django.conf import settings
from django.contrib import admin
from django.urls import path, include
from django.shortcuts import render
from django.conf.urls.static import static
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView



# Home view for the index page
def home(request):
    return render(request, 'index.html')


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.usr.urls')),
    path('api/purchases/', include('apps.purchases.urls')),
    path('', home, name='home'),
    
    path('api/schema/file', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/swagger_ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += staticfiles_urlpatterns()
if not settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)



# Customize the admin site headers and titles
admin.site.site_header = "PurchaseGate | Admin"
admin.site.index_title = "Management"
admin.site.site_title = "Control Panel"