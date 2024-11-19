"""Defines URL patterns for dino_app"""

from django.urls import path
from . import views

app_name = 'dino_app'

urlpatterns = [
    # home page
    path('', views.index, name='index'),
]