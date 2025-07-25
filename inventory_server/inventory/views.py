from django.shortcuts import render
from django.http import HttpResponse, FileResponse, JsonResponse
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import check_password
from django.core.mail import send_mail
from reportlab.pdfgen import canvas
from collections import defaultdict
import io, csv
from datetime import datetime

from .models import *
from .serializers import *

# CRUD ViewSets
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    permission_classes = [IsAuthenticated]

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticated]

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

# Login endpoint
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({'error': 'Invalid credentials'}, status=400)

        if not check_password(password, user.password):
            return Response({'error': 'Invalid password'}, status=400)

        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'role': user.role
        })

# ------------------
# Export: Products
# ------------------
class ProductCSVExportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="products.csv"'
        writer = csv.writer(response)
        writer.writerow(['Name', 'Category', 'Supplier', 'Quantity', 'Price'])

        for p in Product.objects.all():
            writer.writerow([
                p.name,
                p.category.name if p.category else '',
                p.supplier.name if p.supplier else '',
                p.quantity,
                p.price
            ])
        return response

class ProductPDFExportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        buffer = io.BytesIO()
        p = canvas.Canvas(buffer)
        p.drawString(100, 800, "Product Inventory Report")
        y = 780

        for product in Product.objects.all():
            line = f"{product.name} - {product.quantity} units - ${product.price}"
            p.drawString(100, y, line)
            y -= 20
            if y < 50:
                p.showPage()
                y = 800

        p.showPage()
        p.save()
        buffer.seek(0)
        return FileResponse(buffer, as_attachment=True, filename='products.pdf')

# ------------------
# Export: Orders
# ------------------
class OrderCSVExportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="orders.csv"'
        writer = csv.writer(response)
        writer.writerow(['Customer', 'Status', 'Created At', 'Items'])

        for order in Order.objects.all():
            items = ', '.join(f"{item.product.name} x{item.quantity}" for item in order.items)
            writer.writerow([
                order.customer.name if order.customer else '',
                order.status,
                order.created_at.strftime("%Y-%m-%d"),
                items
            ])
        return response

class OrderPDFExportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        buffer = io.BytesIO()
        p = canvas.Canvas(buffer)
        p.drawString(100, 800, "Orders Report")
        y = 780

        for order in Order.objects.all():
            p.drawString(100, y, f"{order.customer.name} | {order.status} | {order.created_at.strftime('%Y-%m-%d')}")
            y -= 20
            for item in order.items:
                p.drawString(120, y, f"→ {item.product.name} x{item.quantity}")
                y -= 15
            y -= 10
            if y < 50:
                p.showPage()
                y = 800

        p.save()
        buffer.seek(0)
        return FileResponse(buffer, as_attachment=True, filename='orders.pdf')

# ------------------
# Dashboard API
# ------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def sales_summary(request):
    result = defaultdict(float)
    for order in Order.objects.all():
        if order.created_at:
            month = order.created_at.strftime("%b")
            result[month] += float(order.total_price)
    return JsonResponse(
        [{'month': m, 'sales': round(s, 2)} for m, s in result.items()],
        safe=False
    )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def inventory_summary(request):
    total = Product.objects.count()
    low_stock = Product.objects.filter(quantity__lte=10).count()
    return JsonResponse({"total": total, "lowStock": low_stock})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def ping(request):
    return JsonResponse({"message": "Token valid"})
