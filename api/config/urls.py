from django.conf import settings
from django.contrib import admin
from django.urls import path, include
from django.shortcuts import render
from django.conf.urls.static import static
from django.contrib.staticfiles.urls import staticfiles_urlpatterns



# Home view for the index page
def home(request):
    return render(request, 'index.html')


urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('apps.usr.urls')),
    path('purchases/', include('apps.purchases.urls')),
    path('', home, name='home'),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += staticfiles_urlpatterns()
if not settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)



# Customize the admin site headers and titles
admin.site.site_header = "PurchaseGate | Admin"
admin.site.index_title = "Management"
admin.site.site_title = "Control Panel"