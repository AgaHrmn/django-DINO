var initial_len = 0;

var map = L.map('map').setView([51.1079, 17.0385], 8);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

function createButton(label, container) {
    var btn = L.DomUtil.create('button', '', container);
    btn.setAttribute('type', 'button');
    btn.innerHTML = label;
    return btn;
}

    // Function to update the OSRM profile (foot or bike)
function getActivityProfile() {
    var activityType = document.getElementById('id_activity_type').value;
    if (activityType === 'Bike') {
        return 'bike';  // Use 'bike' profile if selected
    } else {
        return 'foot';  // Default to 'foot' profile for other activities
    }
}

var control = L.Routing.control({
    waypoints: [],
    routeWhileDragging: false,
    draggableWaypoints: true, // let user make adjustments to the generated route
    show: false,
    lineOptions : {
        addWaypoints: false // don't let user change routes here
    },
    router: new L.Routing.osrmv1({
        profile: getActivityProfile(), // change routing profile based on activity
    }),
})
.on('waypointschanged', function(e) {
    // get waypoints 
    var waypoints = control.getWaypoints(e)
    // extract only latLng values from waypoint (there are also name, options, and _initHooksCalled)
    .map(function(waypoint) {
        return waypoint.latLng; // Extract the latLng property
    });
    document.getElementById('id_waypoints_list').value = JSON.stringify(waypoints);
    //console.log(document.getElementById('id_waypoints_list').value);
    control.getRouter().options.profile = getActivityProfile()
    control.route();
})
.on('routesfound', function(e) {
    // extract the total distance in meters
    var length = e.routes[0].summary.totalDistance; 
    // convert the distance to kilometers
    var formattedLength = (length / 1000).toFixed(2);
    document.getElementById('id_length').value = formattedLength;
    // console.log(formattedLength);
})
.on('routeselected', function(routes) {
// console.log(routes.route.coordinates)
document.getElementById('id_trackpoints_list').value = JSON.stringify(routes.route.coordinates);
})
.addTo(map);

map.on('click', function(e) {
    var container = L.DomUtil.create('div'),
        startBtn = createButton('Starting point', container);
        clearRouteBtn = createButton('Clear', container);

    L.popup()
        .setContent(container)
        .setLatLng(e.latlng)
        .openOn(map);

    // Add event listeners to buttons inside the click event handler
    L.DomEvent.on(startBtn, 'click', function() {
        initial_len = document.getElementById('id_length').value
        control.spliceWaypoints(0, 1, e.latlng); // Update the start waypoint

        for (let i = 0; i < 3; i++){
            var waypoints = control.getWaypoints(e)
            // extract only latLng values from waypoint (there are also name, options, and _initHooksCalled)
            .map(function(waypoint) {
                return waypoint.latLng; // Extract the latLng property
            });

            var start = waypoints[i]; 
            var distance = 175 * initial_len; 
            var bearing = Math.floor(Math.random() * 90) * i; // random direction

            var newPoint = generateWaypoint(start, distance, bearing);
            control.spliceWaypoints(control.getWaypoints().length - 1, 0, newPoint);
        }
        control.spliceWaypoints(control.getWaypoints().length - 1, 1, waypoints[0]) // last point is alfo the first to generate loop 
        map.closePopup();
    });
    L.DomEvent.on(clearRouteBtn, 'click', function() {
        control.setWaypoints([]);  // clear the route and waypoints
        map.closePopup();
        document.getElementById('id_waypoints_list').value = JSON.stringify([]); // clear form
        document.getElementById('id_length').value = initial_len; // reset length from users input
    });
});

// Haversine formula to calculate a new waypoint based on a given distance and starting point
function toRadians(degrees) {
return degrees * Math.PI / 180;
}

function toDegrees(radians) {
    return radians * 180 / Math.PI;
}

function generateWaypoint(start, distance, bearing) {
    var R = 6371e3; // Earth's radius in meters
    var lat1 = toRadians(start.lat);
    var lon1 = toRadians(start.lng);
    var dByR = distance / R; // Angular distance

    var newLat = Math.asin(Math.sin(lat1) * Math.cos(dByR) + 
                        Math.cos(lat1) * Math.sin(dByR) * Math.cos(toRadians(bearing)));

    var newLon = lon1 + Math.atan2(Math.sin(toRadians(bearing)) * Math.sin(dByR) * Math.cos(lat1), 
                                Math.cos(dByR) - Math.sin(lat1) * Math.sin(newLat));

    return { lat: toDegrees(newLat), lng: toDegrees(newLon) };
}