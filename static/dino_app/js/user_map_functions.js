var map = L.map('map').setView([51.1079, 17.0385], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

function createButton(label, container) {
    var btn = L.DomUtil.create('button', '', container);
    btn.setAttribute('type', 'button');
    btn.innerHTML = label;
    return btn;
}

// Declare control variable globally
var control = L.Routing.control({
    waypoints: [],
    routeWhileDragging: false,
})
.on('routesfound', function(e) {
    // extract the total distance in meters
    var length = e.routes[0].summary.totalDistance; 
    // convert the distance to kilometers
    var formattedLength = (length / 1000).toFixed(2)
    // set the formatted distance as the value of the input field
    document.getElementById('id_length').value = formattedLength;
})
.on('waypointschanged', function(e) {
    // get waypoints 
    var waypoints = control.getWaypoints(e)
    // extract only latLng values from waypoint (there are also name, options, and _initHooksCalled)
    .map(function(waypoint) {
        return waypoint.latLng; // Extract the latLng property
    });
    document.getElementById('id_waypoints_list').value = JSON.stringify(waypoints);
})
.on('routeselected', function(routes) {
    // console.log(routes.route.coordinates)
    document.getElementById('id_trackpoints_list').value = JSON.stringify(routes.route.coordinates);
    })
.addTo(map);

map.on('click', function(e) {
    var container = L.DomUtil.create('div'),
        startBtn = createButton('Start from this location', container),
        destBtn = createButton('Go to this location', container);
        addWaypointBtn = createButton('Add a waypoint', container);
        clearRouteBtn = createButton('Clear', container);

    L.popup()
        .setContent(container)
        .setLatLng(e.latlng)
        .openOn(map);

    // Add event listeners to buttons inside the click event handler
    L.DomEvent.on(startBtn, 'click', function() {
        control.spliceWaypoints(0, 1, e.latlng);  // Update the start waypoint
        map.closePopup();
    });

    L.DomEvent.on(destBtn, 'click', function() {
        control.spliceWaypoints(control.getWaypoints().length - 1, 1, e.latlng);  // Update the destination waypoint
        map.closePopup();
    });

    // my buttons
    L.DomEvent.on(addWaypointBtn, 'click', function() {
        control.spliceWaypoints(control.getWaypoints().length - 1, 0, e.latlng);  // Add new waypoint to map
        map.closePopup();
    });
    L.DomEvent.on(clearRouteBtn, 'click', function() {
        control.setWaypoints([]);  // Clear the route and waypoints
        map.closePopup();
        document.getElementById('id_waypoints_list').value = JSON.stringify([]);
        document.getElementById('id_length').value = 0
    });
});