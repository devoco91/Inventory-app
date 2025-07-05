from celery import shared_task
from .models import Product
from django.core.mail import send_mail

@shared_task
def check_low_stock():
    low_stock_products = Product.objects.filter(quantity__lte=10)
    if low_stock_products:
        product_names = ', '.join(p.name for p in low_stock_products)
        send_mail(
            'Low Stock Alert',
            f'These products are low in stock: {product_names}',
            'admin@inventory.com',
            ['admin@inventory.com']
        )
