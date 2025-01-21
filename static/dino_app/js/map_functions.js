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
    routeWhileDragging: true,
})
.on('routeselected', function(e) {
var route = e.route;
console.log(route.inputWaypoints)
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
    });
});

// save waypoints to JSON in hidden form field
function saveWaypointsToHiddenField() {
    var waypoints = control.getWaypoints().map(function(wp) {
        if (wp.latLng) {
            return { lat: wp.latLng.lat, lng: wp.latLng.lng };
        }
    }).filter(Boolean); // Remove any undefined entries

    console.log(document.getElementById('id_waypoints_list').value);
    // Convert to JSON and store in the hidden form field
    document.getElementById('id_waypoints_list').value = JSON.stringify(waypoints);
}

// Add event listener before form submission to ensure waypoints are saved
document.getElementById('route-form').addEventListener('submit', function() {
    saveWaypointsToHiddenField();
});
