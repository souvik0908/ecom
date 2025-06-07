from django.urls import path
from app.views.chat_with_model import chat_with_model
from app.views import chat_views as views

urlpatterns = [
    path('', chat_with_model, name='chat-with-model'),
    path('chat/save/', views.save_chat_message),
    path('chat/history/', views.get_chat_history),
]

