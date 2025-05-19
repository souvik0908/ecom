from django.urls import path
from app.views.chat_with_model import chat_with_model

urlpatterns = [
    path('', chat_with_model, name='chat-with-model'),
]
