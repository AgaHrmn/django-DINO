import os
from django.shortcuts import render, redirect
from django.http import HttpResponse
import rasterio

from dino import settings
from .models import Route
from .forms import RouteForm
import json
from django.core.paginator import Paginator

def dummy(request):
    """Home page for DINO"""
    route = Route.objects.get(id=25)
    route.waypoints_list = json.dumps(route.waypoints_list)
    context = {'route' : route}
    return render(request, 'dino_app/dummy.html',context)

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
    context = {'route' : route}
    return render(request, 'dino_app/route.html', context)
    
def new_route(request):
    """Create new route"""
    # return HttpResponse("OK") # validation
    if request.method != 'POST':
        # Create blank form
        form = RouteForm(readonly_length=True)
        # print(request.POST)
    else:
        # Prcess POST data
        form = RouteForm(data=request.POST,readonly_length=True)
        # print(request.POST)
        if form.is_valid():
            form.save()
            return redirect('dino_app:routes')
        else: 
            print(form.errors)
    # Display blank or invalid form
    context = {'form': form}
    return render(request, 'dino_app/new_route.html', context)

def generate_route(request):
    """Create new route"""
    if request.method != 'POST':
        # Create blank form
        form = RouteForm(readonly_length=False)

    else:
        # Prcess POST data
        form = RouteForm(data=request.POST,readonly_length=False)
        if form.is_valid():
            form.save()
            return redirect('dino_app:routes')
        else: 
            print(form.errors)
    # Display blank or invalid form
    context = {'form': form}
    return render(request, 'dino_app/generate_route.html', context)

def save_gpx(request, route_id):
    """Generate gpx file with route details"""
    route = Route.objects.get(id=route_id)
    parsed_trackpoints = parse_trackpoints(route.trackpoints_list)
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
            {parsed_trackpoints}
        </trkseg>
    </trk>
</gpx>'''.strip()

    response = HttpResponse(gpx_template, content_type="application/gpx+xml")
    response['Content-Disposition'] = f'attachment; filename="{route.title}.gpx"'

    return response

def parse_trackpoints(trackpoints_json):
    """Convert trackpoints to XML format"""

    parsed_string=""
    for trackpoint in trackpoints_json:
        elevation = extract_elevation(trackpoint)
        parsed_string += f'''
            <trkpt lat="{trackpoint["lat"]}" lon="{trackpoint["lng"]}">
                <ele>{elevation}</ele>
                <time></time>
            </trkpt>'''
    return parsed_string

def extract_elevation(trackpoint):
    """Extract elevation data from trackpoints using DEM"""
    dem_file = os.path.join(settings.BASE_DIR, 'static', 'dino_app', 'geotiff_data', 'GDEM-10km-BW.tif') # GDEM-10km-BW.tif ebk1km1.tif
    lat, lon = trackpoint["lat"], trackpoint["lng"]

    with rasterio.open(dem_file) as dataset:
        # Get the affine transformation from geospatial coordinates to pixel coordinates
        transform = dataset.transform

        # Convert latitude/longitude (WGS84) to pixel coordinates (row, col)
        col, row = ~transform * (lon, lat)  # ~transform is the inverse of the affine transform
        
        # Make sure the row/col are within bounds
        if 0 <= col < dataset.width and 0 <= row < dataset.height:
            # Read the elevation at the specified row/col
            elevation = dataset.read(1, window=rasterio.windows.Window(col, row, 1, 1))[0]
            return elevation[0]
        else:
            return None  # If the coordinates are out of bounds