## Installation 

*    Install Leaflet

```pip install django-leaflet```

*    GDAL library 

[GDAL](https://gdal.org/en/stable/) is a translator library for raster and vector geospatial data formats that is released under an X/MIT style Open Source license by the Open Source Geospatial Foundation.

1. Start with installation of [OSGeo4W](https://trac.osgeo.org/osgeo4w/)

2. Install [Microsoft Visual C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) -> Desktop development with C++

If Visual C++ Build Tools are not installed You may encounter following errors: 
```
  ERROR: Failed building wheel for gdal
  Failed to build gdal
  ERROR: Could not build wheels for gdal, which is required to install pyproject.toml-based projects
```

3. Environment setup and final checks

Instruction - [Thank God for this tutorial](https://stackoverflow.com/questions/71847139/solution-to-installing-gdal-proj-geos-in-windows-10-for-django-geodjango)

* Sample leaflet map html code: 

```
<div id="map"></div>

    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" 
    integrity="sha384-pH5Y3vHOS2i1IG+rXtCslLRvf5EAslgjcmzAkChm0fRYlXhV5vsqfE9fRBur3a1c" 
    crossorigin="">
    // Loads the Leaflet.js library (v1.9.4) from a CDN with integrity check to ensure secure and untampered files.
    </script>

    <script>
        // Initialize the map and set its view to Wrocław, Poland
        var map = L.map('map').setView([51.1079, 17.0385], 13);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Add a marker for Wrocław
        var marker = L.marker([51.1079, 17.0385]).addTo(map);
        marker.bindPopup("Wrocław, Poland").openPopup();
    </script>

```
