from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from app.models import ChatMessage
from app.serializer import ChatMessageSerializer
from django.utils.timezone import now
import os

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_chat_message(request):
    data = request.data
    user = request.user

    # Save to DB
    chat = ChatMessage.objects.create(
        user=user,
        message=data['message'],
        is_user=data.get('is_user', True)
    )
    serializer = ChatMessageSerializer(chat, many=False)

    # Save to text file
    log_dir = os.path.join("chat_logs")
    os.makedirs(log_dir, exist_ok=True)

    filename = os.path.join(log_dir, f"{user.username}.txt")
    timestamp = now().strftime("%Y-%m-%d %H:%M:%S")
    role = "User" if data.get('is_user', True) else "Bot"

    with open(filename, "a", encoding="utf-8") as f:
        f.write(f"[{timestamp}] {role}: {data['message']}\n")

    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_chat_history(request):
    messages = ChatMessage.objects.filter(user=request.user).order_by('timestamp')
    serializer = ChatMessageSerializer(messages, many=True)
    return Response(serializer.data)
