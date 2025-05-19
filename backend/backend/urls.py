from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.middleware.csrf import get_token 
from django.http import JsonResponse  # Add this import
from django.conf.urls.static import static
from django.views.decorators.csrf import ensure_csrf_cookie
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/products/', include('app.urls.product_urls')),
    path('api/orders/', include('app.urls.order_urls')),
    path('api/users/', include('app.urls.user_urls')),
    path('api/chat/', include('app.urls.chat_urls')),  # This is sufficient
    path('api/csrf-token/', ensure_csrf_cookie(lambda request: JsonResponse({"csrfToken": get_token(request)}))),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)