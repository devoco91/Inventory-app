from django.db import models

# Create your models here.
import mongoengine as me

class User(me.Document):
    username = me.StringField(required=True, unique=True)
    password = me.StringField(required=True)
    role = me.StringField(choices=['admin', 'staff'], default='staff')

class Category(me.Document):
    name = me.StringField(required=True)

class Supplier(me.Document):
    name = me.StringField(required=True)
    contact_email = me.EmailField()

class Product(me.Document):
    name = me.StringField(required=True)
    category = me.ReferenceField(Category)
    supplier = me.ReferenceField(Supplier)
    quantity = me.IntField()
    price = me.FloatField()

class Customer(me.Document):
    name = me.StringField(required=True)
    email = me.EmailField()

class OrderItem(me.EmbeddedDocument):
    product = me.ReferenceField(Product)
    quantity = me.IntField()

class Order(me.Document):
    customer = me.ReferenceField(Customer)
    status = me.StringField(choices=['pending', 'shipped', 'delivered'], default='pending')
    items = me.EmbeddedDocumentListField(OrderItem)
    created_at = me.DateTimeField()

