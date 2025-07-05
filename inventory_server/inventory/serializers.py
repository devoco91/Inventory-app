from rest_framework_mongoengine import serializers
from .models import *

class UserSerializer(serializers.DocumentSerializer):
    class Meta:
        model = User
        fields = '__all__'

class CategorySerializer(serializers.DocumentSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class SupplierSerializer(serializers.DocumentSerializer):
    class Meta:
        model = Supplier
        fields = '__all__'

class ProductSerializer(serializers.DocumentSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class CustomerSerializer(serializers.DocumentSerializer):
    class Meta:
        model = Customer
        fields = '__all__'

class OrderItemSerializer(serializers.EmbeddedDocumentSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'

class OrderSerializer(serializers.DocumentSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = '__all__'
