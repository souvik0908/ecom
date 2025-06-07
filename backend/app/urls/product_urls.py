from django.urls import path
from app.views import product_views as views

urlpatterns = [
    path('', views.getProducts, name="products"),
    path('create/', views.createProduct, name="product-create"),
    path('update/<str:pk>/', views.updateProduct, name="product-update"),
    path('upload/', views.uploadImage, name="image-upload"),
    path('delete/<str:pk>/', views.deleteProduct, name="product-delete"),
    path('products_search/', views.get_products, name="product-search"),
    path('<str:pk>/reviews/', views.createProductReview, name="product-review"),

    path('<str:pk>/', views.getProduct, name="product-detail"),
]
