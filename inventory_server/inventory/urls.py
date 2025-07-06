from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.http import JsonResponse
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    ProductViewSet, SupplierViewSet, CategoryViewSet,
    CustomerViewSet, OrderViewSet, CustomTokenObtainPairView,
    ProductCSVExportView, ProductPDFExportView,
    OrderCSVExportView, OrderPDFExportView,
    sales_summary, inventory_summary
)

router = DefaultRouter()
router.register('products', ProductViewSet, basename='product')
router.register('categories', CategoryViewSet, basename='category')
router.register('suppliers', SupplierViewSet, basename='supplier')
router.register('customers', CustomerViewSet, basename='customer')
router.register('orders', OrderViewSet, basename='order')

urlpatterns = [
    path('', include(router.urls)),

    # JWT Auth Endpoints
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path("health/", lambda req: JsonResponse({"status": "ok"})),

    # Products Export
    path('export/products/csv/', ProductCSVExportView.as_view(), name='export_products_csv'),
    path('export/products/pdf/', ProductPDFExportView.as_view(), name='export_products_pdf'),

    # Orders Export
    path('export/orders/csv/', OrderCSVExportView.as_view(), name='export_orders_csv'),
    path('export/orders/pdf/', OrderPDFExportView.as_view(), name='export_orders_pdf'),

    # Dashboard APIs
    path('dashboard/sales/', sales_summary),
    path('dashboard/inventory/', inventory_summary),
]
