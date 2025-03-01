"""Defines URL patterns for dino_app"""

from django.urls import path
from . import views

app_name = 'dino_app'

urlpatterns = [
    # home page
    path('', views.index, name='index'),
    # all routes
    path('routes/', views.routes, name='routes'),
    # detail page for single route
    path('routes/<int:route_id>/', views.route, name='route'),
    # new route
    path('new_route/', views.new_route, name='new_route'),

    # save GPX
    path('routes/<int:route_id>/save_gpx/', views.save_gpx, name='save_gpx'),
    # generate new route automatically 
    path('generate_route/', views.generate_route, name='generate_route'),

    # development dummy page
    path('dummy/', views.dummy, name='dummy'),
]