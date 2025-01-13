from django.shortcuts import render, redirect
from django.http import HttpResponse
from .models import Route
from .forms import RouteForm

def index(request):
    """Home page for DINO"""
    return render(request, 'dino_app/index.html')

def routes(request):
    """View created routes"""
    routes = Route.objects.order_by('-date_added') #newest to oldest
    context = {'routes' : routes}
    return render(request, 'dino_app/routes.html', context)
    
def new_route(request):
    """Create new route"""
    # return HttpResponse("OK") # validation
    if request.method != 'POST':
        # Create blank form
        form = RouteForm()
    else:
        # Prcess POST data
        form = RouteForm(data=request.POST)
        if form.is_valid():
            form.save()
            return redirect('dino_app:routes')
    # Display blank or invalid form
    context = {'form': form}
    return render(request, 'dino_app/new_route.html', context)

def dummy(request):
    """Home page for DINO"""
    return render(request, 'dino_app/dummy.html')