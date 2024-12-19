"""Defines URL patterns for dino_app"""

from django.urls import path
from . import views

app_name = 'dino_app'

urlpatterns = [
    # home page
    path('', views.index, name='index'),
    # all routes
    path('routes/', views.routes, name='routes'),
    # new route
    path('new_route/', views.new_route, name='new_route'),
]