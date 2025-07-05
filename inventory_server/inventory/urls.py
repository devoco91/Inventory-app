from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    ProductViewSet, SupplierViewSet, CategoryViewSet,
    CustomerViewSet, OrderViewSet, LoginView,
    ProductCSVExportView, ProductPDFExportView,
    OrderCSVExportView, OrderPDFExportView
)

router = DefaultRouter()
router.register('products', ProductViewSet, basename='product')
router.register('categories', CategoryViewSet, basename='category')
router.register('suppliers', SupplierViewSet, basename='supplier')
router.register('customers', CustomerViewSet, basename='customer')
router.register('orders', OrderViewSet, basename='order')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/login/', LoginView.as_view(), name='login'),

    # Products Export
    path('export/products/csv/', ProductCSVExportView.as_view(), name='export_products_csv'),
    path('export/products/pdf/', ProductPDFExportView.as_view(), name='export_products_pdf'),

    # Orders Export
    path('export/orders/csv/', OrderCSVExportView.as_view(), name='export_orders_csv'),
    path('export/orders/pdf/', OrderPDFExportView.as_view(), name='export_orders_pdf'),
]
