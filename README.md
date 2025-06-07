🛒 E-Commerce Sales Chatbot
Overview
This project is a comprehensive E-commerce Sales Chatbot System that simulates a real-world e-commerce experience. It features a full-stack architecture that enables users to search, explore, and interact with products using a chatbot interface.

The backend is built using Django + Django Rest Framework, the frontend is a React + Redux SPA, and communication with the chatbot is facilitated via API calls to a locally hosted Mistral-based LLM.



---

## 🚀 Project Summary

This project simulates a conversational sales assistant for an e-commerce platform dealing with **[insert product category, e.g., Electronics or Books]**. It supports product discovery, customer queries, and order history review using a natural language interface. A mock product catalog is managed via a Django REST API, and interactions are handled with a locally hosted LLM.

---

## 📁 Project Structure

ecommerce-chatbot/
│
├── backend/ # Django backend
│ ├── app/
│ │ ├── models.py # Product, Order, OrderItem models
│ │ ├── views # Folder contains all Views.py
│ │ └── urls   # Folder contains all urls.py
│ ├── manage.py
│ ├── db.sqlite3 # Mock database with 100+ products
│ └── settings.py
│
├── frontend/ # React frontend
│ ├── src/
│ │ ├── components/
│ │ ├── screens/
│ │ ├── Actions/
│ │ ├── Reducers/
│ │ ├── App.js
│ │ └── index.js
│ └── public/
│
├── chat_response.txt # Stores all chatbot interactions
├── README.md
└── requirements.txt

---

## 🧑‍💻 Features

### ✅ Frontend

- Responsive React-based UI (compatible with desktop, tablet, mobile)
- JWT-based authentication module (login/logout/register)
- Chatbot interface with:
  - Timestamped messages
  - Reset conversation button
  - Product links and visual previews
- Stored chat logs for later retrieval


## 🛠️ Technology Stack

| Layer       | Tools/Frameworks                              |
|------------|------------------------------------------------|
| Frontend   | React, Bootstrap, CSS3, Axios                  |
| Backend    | Django, Django REST Framework, JWT Auth        |
| Database   | SQLite (mock data)                             |
| AI Model   | Mistral (locally served via Ollama or HTTP API)|
| Storage    | Plain text logging (`chat_response.txt`)       |

🔧 Tech Stack
Frontend
React

Redux Toolkit for state management

React Bootstrap for UI components

Axios for API communication

Backend
Django + Django Rest Framework

JWT Authentication via SimpleJWT

SQLite (for mock product/order/user data)

Custom chatbot view with LLM integration

Chat Model
Hosted locally using ollama

LLM: hf.co/souvik2132/Mistral_support:Q4_K_M

📦 Features
🧠 Chatbot Features
Product query handling

Order tracking and history fetch

Recommends products based on conversation

Product mentions in replies are parsed and highlighted

Logs every chatbot interaction in a .txt file

🛍️ E-Commerce Functionalities
User

Register/Login (JWT-secured)

Profile & order history

Product

CRUD operations

Real-time search

Ratings and reviews

Order

Place orders

View order history

List of Users

Track delivery/payment status

🖥️ Frontend UI Screens
✅ Login/Register

🧑‍💼 User Profile (JWT-protected)

🛒 Product Listing

🔍 Product Details + Review system

📦 Order Summary

💬 Chatbot Interface

Animated chatbot logo (Lottie)

Persistent chat log

Conversation reset button

Timestamps for each message

📡 API Documentation
🔐 Authentication & Users

| Endpoint                      | Method | Description                     | Access        |
| ----------------------------- | ------ | ------------------------------- | ------------- |
| `/api/users/login/`           | POST   | Get JWT token (email, password) | Public        |
| `/api/users/register/`        | POST   | Register new user               | Public        |
| `/api/users/profile/`         | GET    | Get logged-in user's profile    | Private (JWT) |
| `/api/users/profile/update/`  | PUT    | Update user profile             | Private (JWT) |
| `/api/users/`                 | GET    | Get all users (admin only)      | Admin Only    |
| `/api/users/<str:pk>/`        | GET    | Get a single user by ID         | Admin Only    |
| `/api/users/delete/<str:pk>/` | DELETE | Delete a user by ID             | Admin Only    |
| `/api/users/update/<str:pk>/` | PUT    | Update user data                | Admin Only    |


🛍️ Products
| Endpoint                          | Method | Description                          | Access        |
| --------------------------------- | ------ | ------------------------------------ | ------------- |
| `/api/products/`                  | GET    | Get all products                     | Public        |
| `/api/products/<str:pk>/`         | GET    | Get product details                  | Public        |
| `/api/products/create/`           | POST   | Create a new product                 | Admin Only    |
| `/api/products/update/<str:pk>/`  | PUT    | Update a product                     | Admin Only    |
| `/api/products/delete/<str:pk>/`  | DELETE | Delete a product                     | Admin Only    |
| `/api/products/upload/`           | POST   | Upload an image for a product        | Admin Only    |
| `/api/products/<str:pk>/reviews/` | POST   | Submit a product review              | Private (JWT) |
| `/api/products/products_search/`  | GET    | Search/filter products (query param) | Public        |


📦 Orders
| Endpoint                             | Method | Description                        | Access        |
| ------------------------------------ | ------ | ---------------------------------- | ------------- |
| `/api/orders/`                       | GET    | Get all orders (admin only)        | Admin Only    |
| `/api/orders/add/`                   | POST   | Create new order                   | Private (JWT) |
| `/api/orders/myorders/`              | GET    | Get logged-in user's order history | Private (JWT) |
| `/api/orders/<str:pk>/`              | GET    | Get specific order by ID           | Private (JWT) |
| `/api/orders/<str:orderId>/pay/`     | PUT    | Mark order as paid                 | Admin/User    |
| `/api/orders/<str:orderId>/deliver/` | PUT    | Mark order as delivered            | Admin Only    |

💬 Chatbot
| Endpoint                  | Method | Description                                 | Access        |
| ------------------------- | ------ | ------------------------------------------- | ------------- |
| `/api/chat/`              | POST   | Interact with the chatbot                   | Private (JWT) |
| `/api/chat/chat/save/`    | POST   | Save a user message and response to history | Private (JWT) |
| `/api/chat/chat/history/` | GET    | Retrieve chat history of the user           | Private (JWT) |

🧪 Mock Data
Over 100 product entries were inserted using a custom Django management script or direct JSON fixture imports.

Categories include:

Electronics

Books

Textiles

Each product includes:

Name, price, brand, category

Count in stock

Rating and review count

Description and image

🧠 Chatbot Prompt Logic
The chatbot receives the user's message and generates a structured prompt with:

Full product catalog

User's specific order history

System rules to ensure secure, personalized replies

Parsed replies are checked for product names to attach metadata like product ID, image, price, and links.

All conversations are saved to chat_response.txt for analysis.

📋 Project Setup
Clone and Setup
bash
Copy code
git clone https://github.com/yourusername/ecommerce-chatbot.git
cd ecommerce-chatbot
Backend (Django)
bash
Copy code
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
Frontend (React)
bash
Copy code
cd frontend
npm install
npm start
LLM Server (Ollama)
bash
Copy code
ollama run souvik2132/Mistral_support:Q4_K_M
🧪 Sample Queries
“What’s the cheapest smartwatch?”

“Did I order a book last week?”

“Show me any available cotton shirts.”

“Track my order with ID #1234.”

🧱 Architecture
css
Copy code
[ React + Redux ]  <--->  [ Django REST API ]  <--->  [ Ollama (Mistral LLM) ]
        ↑                         ↑
     Login/Auth            Product & Order
     Chat UI               Management

🚧 Challenges & Solutions
🔐 Token Expiry Handling
Implemented custom error messages and auto-logout for expired JWT tokens.

🧠 LLM Latency
Optimized prompt to include only necessary product/order info to reduce response delay.

📦 Product Mention Detection
Normalized product names and used simple text search to extract matched items from responses.

