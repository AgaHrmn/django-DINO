from django.shortcuts import render, redirect
from django.http import HttpResponse
from .models import Route
from .forms import RouteForm
import json
from django.core.paginator import Paginator

def index(request):
    """Home page for DINO"""
    return render(request, 'dino_app/index.html')

def routes(request):
    """View created routes"""

    ACTIVITIES_ICONS= {
        "Run": "🏃",
        "Walk" : "🚶",
        "Hike" : "🥾",
        "Road bike" : "🚴‍♂️",
        "Mountain bike" : "🚵‍♂️",
    }

    routes = Route.objects.all().order_by('-date_added') #newest to oldest

    for route in routes: 
        for k,v in ACTIVITIES_ICONS.items():
            if route.activity_type == k:
                route.icon = v
                route.save()

    paginator = Paginator(routes, 5)  # Show 5 routes per page
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    context = {"page_obj": page_obj}
    return render(request, 'dino_app/routes.html', context)

def route(request, route_id):
    """Show a single route and its details"""
    route = Route.objects.get(id=route_id)
    # convert list of dictionaries to a JSON string
    route.waypoints_list = json.dumps(route.waypoints_list)
    context = {'route' : route}
    return render(request, 'dino_app/route.html', context)
    
def new_route(request):
    """Create new route"""
    # return HttpResponse("OK") # validation
    if request.method != 'POST':
        # Create blank form
        form = RouteForm()
        print(request.POST)
    else:
        # Prcess POST data
        form = RouteForm(data=request.POST)
        print(request.POST)
        if form.is_valid():
            form.save()
            return redirect('dino_app:routes')
        else: 
            print(form.errors)
    # Display blank or invalid form
    context = {'form': form}
    return render(request, 'dino_app/new_route.html', context)

def dummy(request):
    """Home page for DINO"""
    route = Route.objects.get(id=25)
    route.waypoints_list = json.dumps(route.waypoints_list)
    context = {'route' : route}
    return render(request, 'dino_app/dummy.html',context)