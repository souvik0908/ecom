from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from app.models import Product, Order, OrderItem
from django.contrib.auth.models import User
import requests
import json
import jwt
from django.conf import settings

@csrf_exempt
def chat_with_model(request):
    try:
        # --- Extract and validate JWT token ---
        auth_header = request.headers.get('Authorization', None)
        if not auth_header or not auth_header.startswith('Bearer '):
            return JsonResponse({"error": "Authentication required. Please log in."}, status=401)

        token = auth_header.split(' ')[1]
        try:
            decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            user_id = decoded.get('user_id')
            user = User.objects.get(id=user_id)
        except (jwt.DecodeError, jwt.ExpiredSignatureError, User.DoesNotExist):
            return JsonResponse({"error": "Invalid or expired token. Please log in again."}, status=401)

        # --- Get message from frontend ---
        data = json.loads(request.body)
        user_message = data['messages'][-1]['content']

        # --- Product Catalog (all products) ---
        products = Product.objects.all()

        product_text = (
            "\n\n".join([
                f"""ID: {p._id}
NAME: {p.name.upper()}
Brand: {p.brand}
Category: {p.category}
Price: ${p.price}
In Stock: {p.countInStock}
Rating: {p.rating} ({p.numReviews} reviews)
Description: {p.description}"""
                for p in products
            ]) if products.exists() else "No products available right now."
        )

        # --- User's Order History ---
        orders = Order.objects.filter(user=user).prefetch_related('orderitem_set')

        if orders.exists():
            order_details = []
            for o in orders:
                items = OrderItem.objects.filter(order=o)
                item_lines = "\n  - ".join([f"{item.qty}x {item.name} @ ₹{item.price}" for item in items]) or "No items"
                order_details.append(f"""
Order ID: {o._id}
Payment Method: {o.paymentMethod}
Total: ${o.totalPrice}
Paid: {"Yes" if o.isPaid else "No"} at {o.paidAt if o.paidAt else "N/A"}
Delivered: {"Yes" if o.isDelivered else "No"} at {o.deliveredAt if o.deliveredAt else "N/A"}
Items:
  - {item_lines}
""")
            order_text = "\n\n".join(order_details)
        else:
            order_text = "You have not placed any orders yet."

        # --- Prompt for LLM ---
        prompt = [
            {
                "role": "system",
                "content": f"""You are a helpful shopping assistant chatbot. The user is authenticated.

Product Catalog:
{product_text}

Their Order History:
{order_text}

Follow these rules:
1. DO NOT reveal order information of any other user.
2. Mention product names in ALL CAPS and include product ID in parentheses.
3. If the user asks about an order you don't have, say: "I can't find that in your order history."
"""
            },
            {
                "role": "user",
                "content": user_message
            }
        ]

        # --- Ollama model call ---
        res = requests.post(
            "http://localhost:11435/api/chat",
            json={
                "model": "hf.co/souvik2132/Mistral_support:Q4_K_M",
                "messages": prompt,
                "stream": False,
            },
            timeout=30
        )
        res.raise_for_status()
        response_data = res.json()
        reply = response_data.get("message", {}).get("content", "Sorry, I couldn’t fetch that.")

        # --- Detect product mentions in reply ---
        detected_products = []
        product_names = {p.name.lower(): p for p in products}
        for line in reply.split('\n'):
            for name, product in product_names.items():
                if name in line.lower():
                    detected_products.append({
                        "id": product._id,
                        "name": product.name,
                        "image": product.image.url if product.image else None,
                        "price": str(product.price),
                        "link": f"/products/{product._id}"
                    })
                    break

        # Remove duplicates
        seen = set()
        unique_products = []
        for p in detected_products:
            if p['id'] not in seen:
                seen.add(p['id'])
                unique_products.append(p)

        return JsonResponse({
            "message": {"content": reply},
            "products": unique_products
        })

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid request format"}, status=400)
    except requests.exceptions.RequestException as e:
        return JsonResponse({"error": f"Model API error: {str(e)}"}, status=503)
    except Exception as e:
        return JsonResponse({"error": f"Server error: {str(e)}"}, status=500)
