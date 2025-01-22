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
.on('routeselected', function(e) {
    var route = e.route;
    console.log(route.inputWaypoints)
})
.on('routesfound', function(e) {
    // extract the total distance in meters
    var length = e.routes[0].summary.totalDistance; 

    // convert the distance to kilometers
    var formattedLength = (length / 1000).toFixed(2)

    // set the formatted distance as the value of the input field
    document.getElementById('id_length').value = formattedLength;

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
        updateWaypoints();
    });

    L.DomEvent.on(destBtn, 'click', function() {
        control.spliceWaypoints(control.getWaypoints().length - 1, 1, e.latlng);  // Update the destination waypoint
        map.closePopup();
        updateWaypoints();
    });

    // my buttons
    L.DomEvent.on(addWaypointBtn, 'click', function() {
        control.spliceWaypoints(control.getWaypoints().length - 1, 0, e.latlng);  // Add new waypoint to map
        map.closePopup();
        updateWaypoints();
    });
    L.DomEvent.on(clearRouteBtn, 'click', function() {
        control.setWaypoints([]);  // Clear the route and waypoints
        map.closePopup();
        updateWaypoints();
        document.getElementById('id_waypoints_list').value = JSON.stringify([]);
        document.getElementById('id_length').value = 0
    });
});

// save waypoints to JSON
function updateWaypoints() {
    var waypoints = control.getWaypoints().map(function(wp) {
        if (wp.latLng) {
            return { lat: wp.latLng.lat, lng: wp.latLng.lng };
        }
    }).filter(Boolean); // Remove any undefined entries

    // set the updated waypoints as the value of the input field
    console.log(JSON.stringify(waypoints));
    console.log(typeof(JSON.stringify(waypoints)));
    document.getElementById('id_waypoints_list').value = JSON.stringify(waypoints);
}

// add event listener before form submission to ensure that length and waypoints are saved
document.getElementById('route-form').addEventListener('submit', function() {
    updateWaypoints();
});