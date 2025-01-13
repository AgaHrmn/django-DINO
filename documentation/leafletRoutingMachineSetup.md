# Leaflet routing machie setup

- Go to [perliedman GitHub page](https://github.com/perliedman/leaflet-routing-machine/releases) and download prefered version of Leaflet Routing Machie.
- Unpack zip file and copy ***dist*** directory to your projects ***static*** directory
- Add link to your html files containing map. In my project I use template inheritance, so link were added to the base.html
```
<!-- ROUTING MACHINE -->
    <link rel="stylesheet" href="{% static 'dino_app/leaflet_routing_machine/leaflet-routing-machine.css' %}" />
```

### Sample html code for map with leaflet routing machine 
```
    <div id="map"></div>

    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" ></script>
    <script src="{% static 'dino_app/leaflet_routing_machine/leaflet-routing-machine.js' %}"></script>

    <script>
        var map = L.map('map').setView([51.1079, 17.0385], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        L.Routing.control({
            waypoints: [
                L.latLng([51.1079, 17.0385]),
                L.latLng([51.7500, 19.4667])
            ],
            routeWhileDragging: true
        }).addTo(map);

    </script>
```

#### Notes
Before running the plugin refresh static files: 
```
python manage.py collect static
```

