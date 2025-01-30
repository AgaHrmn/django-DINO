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
    print(type(route.waypoints_list))
    print(f"Trackpoints loaded: {route.trackpoints_list[:5]}")
    print(type(route.trackpoints_list))

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


def save_gpx(request, route_id):
    """Generate gpx file with route details"""
    route = Route.objects.get(id=route_id)
    gpx_template = f'''<?xml version="1.0" encoding="UTF-8"?>
<gpx xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
     xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd
                         http://www.garmin.com/xmlschemas/GpxExtensions/v3 http://www.garmin.com/xmlschemas/GpxExtensionsv3.xsd
                         http://www.garmin.com/xmlschemas/TrackPointExtension/v1 http://www.garmin.com/xmlschemas/TrackPointExtensionv1.xsd"
     creator="DjangoGPX"
     version="1.1"
     xmlns="http://www.topografix.com/GPX/1/1"
     xmlns:gpxtpx="http://www.garmin.com/xmlschemas/TrackPointExtension/v1"
     xmlns:gpxx="http://www.garmin.com/xmlschemas/GpxExtensions/v3">
    <time>2002-02-27T17:18:33Z</time>
    <trk>
        <name>{route.title}</name>
        <trkseg>
            {parse_trackpoints(json.loads(route.trackpoints_list))}
        </trkseg>
    </trk>
</gpx>'''.strip()
    return gpx_template

def parse_trackpoints(trackpoints_json):
    """Convert trackpoints to XML format"""
    parsed_string=""
    for trackpoint in trackpoints_json:
        parsed_string += f'''
<trkpt lat="{trackpoint["lat"]}" lon="{trackpoint["lng"]}">
    <ele></ele>
    <time></time>
</trkpt>'''
    return parsed_string