from django.shortcuts import render
from .models import Route

def index(request):
    """Home page for DINO"""
    return render(request, 'dino_app/index.html')

def routes(request):
    """View created routes"""
    routes = Route.objects.order_by('date_added')
    context = {'routes' : routes}
    return render(request, 'dino_app/routes.html', context)
    
