from rest_framework import serializers
from .models import Product,Order, OrderItem, ShippingAddress,Review
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken

class HybridImageField(serializers.ImageField):
    """
    Accept either a URL string (when you're just updating metadata)
    or an actual UploadedFile (when you're posting multipart).
    """
    def to_internal_value(self, data):
        # If it's already a string (the URL you stored earlier), just pass it through.
        if isinstance(data, str):
            return data
        # Otherwise run the normal ImageField logic to save the upload.
        return super().to_internal_value(data)
class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'
class ProductSerializer(serializers.ModelSerializer):
    reviews = serializers.SerializerMethodField(read_only=True)

    image = HybridImageField(
        required=False,
        allow_empty_file=True,  # so omitting a file entirely won't error
        use_url=True            # serializes out as URL string
    )

    class Meta:
        model = Product
        fields = '__all__'
        extra_kwargs = {'_id': {'read_only': True}}
        

    def get_reviews(self, obj):
        reviews = obj.review_set.all()
        serializer = ReviewSerializer(reviews, many=True)
        return serializer.data
class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)
    _id = serializers.SerializerMethodField(read_only=True)
    isAdmin = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', '_id', 'username', 'email', 'name', 'isAdmin']

    def get__id(self, obj):
        return obj.id

    def get_isAdmin(self, obj):
        return obj.is_staff

    def get_name(self, obj):
        name = obj.first_name
        if name == '':
            name = obj.email

        return name
class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = User
        fields = ['id', '_id', 'username', 'email', 'name', 'isAdmin','token']
    def get_token(self,obj):
        token=RefreshToken.for_user(obj)
        return str(token.access_token)
class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model=OrderItem
        fields='__all__'
class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model=ShippingAddress
        fields='__all__'
class OrderSerializer(serializers.ModelSerializer):
    orderitems = serializers.SerializerMethodField(read_only=True)
    shippingaddress = serializers.SerializerMethodField(read_only=True)
    user=serializers.SerializerMethodField(read_only=True)
    class Meta:
        model=Order
        fields='__all__'
    def get_orderitems(self,obj):
        items = obj.orderitem_set.all()
        serializer = OrderItemSerializer(items, many=True)
        return serializer.data
    def get_shippingaddress(self,obj):
        try:
            shippingaddress = ShippingAddressSerializer(obj.shippingaddress, many=False).data
        except:
            shippingaddress = False
        return shippingaddress
    def get_user(self,obj):
        user = obj.user
        serializer = UserSerializer(user, many=False)
        return serializer.data