var waypoints_data = document.getElementById('waypoints').value;
var waypoints_json = JSON.parse(waypoints_data);

// replace single quotes witch double for JSONparse to work
var trackpoints_data = document.getElementById('trackpoints').value.replace(/'/g, '"');
var trackpoints_json = JSON.parse(trackpoints_data);
var route_title = document.getElementById('title').value
var route_id = document.getElementById('route_id').value

var map = L.map('map');

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

L.Routing.control({
waypoints: waypoints_json.map(function(waypoint) {
    return L.latLng(waypoint.lat, waypoint.lng)
}),
routeWhileDragging: false,
draggableWaypoints: false,
show: false,
lineOptions : {
    addWaypoints: false // don't let user change routes here
},

})
.addTo(map);

function parse_trackpoints_to_xml(parsed_trackpoints) {
    index = 0
    return parsed_trackpoints.map(function(track_point) {
        return `
            <trkpt lat="${track_point.lat}" lon="${track_point.lng}">
                <ele></ele>
                <time></time>
            </trkpt>`
    }).join('')
}

document.getElementById('save-gpx-button').addEventListener('click', function () {
    const gpxContent = to_GPX(trackpoints_json);
    const blob = new Blob([gpxContent], { type: 'application/gpx+xml' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = route_title + route_id + ".gpx";
    link.click();
    URL.revokeObjectURL(link.href);
});

function to_GPX(parsed_trackpoints) {

    let gpx_file_content = 
`<?xml version="1.0" encoding="UTF-8"?>
<gpx xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
     xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd
                         http://www.garmin.com/xmlschemas/GpxExtensions/v3 http://www.garmin.com/xmlschemas/GpxExtensionsv3.xsd
                         http://www.garmin.com/xmlschemas/TrackPointExtension/v1 http://www.garmin.com/xmlschemas/TrackPointExtensionv1.xsd"
     creator="StravaGPX"
     version="1.1"
     xmlns="http://www.topografix.com/GPX/1/1"
     xmlns:gpxtpx="http://www.garmin.com/xmlschemas/TrackPointExtension/v1"
     xmlns:gpxx="http://www.garmin.com/xmlschemas/GpxExtensions/v3">
    <time>2002-02-27T17:18:33Z</time>
    <bounds minlat="42.401051" minlon="-71.126602" maxlat="42.468655" maxlon="-71.102973"/>
    <trk>
        <name>${route_title}</name>
        <trkseg>
            ${parse_trackpoints_to_xml(parsed_trackpoints)}
        </trkseg>
    </trk>
</gpx>`;
    gpx_file_content.replace(/^\s*\n/gm, "");
    console.log(gpx_file_content);
    return gpx_file_content.trim();
}
