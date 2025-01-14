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

        // Define the routing control globally
        var control = L.Routing.control({
            waypoints: [
                L.latLng([51.1079, 17.0385]),
                L.latLng([51.7500, 19.4667])
            ],
            routeWhileDragging: true
        }).addTo(map);

        // Function to log and show waypoints on the map
        function logWaypoints() {
            var waypoints = control.getWaypoints();
            console.log("Waypoints:", waypoints);

            // Clear existing markers
            if (window.waypointMarkers) {
                window.waypointMarkers.forEach(marker => marker.remove());
            }

            // Create markers for each waypoint and add them to the map
            window.waypointMarkers = waypoints.map(function(waypoint) {
                var marker = L.marker(waypoint.latLng).addTo(map);
                marker.bindPopup("Waypoint: " + waypoint.latLng.toString());
                return marker;
            });
        }

        map.on('click', function(e) {
            var container = L.DomUtil.create('div'),
                startBtn = createButton('Start from this location', container),
                destBtn = createButton('Go to this location', container);

            L.popup()
                .setContent(container)
                .setLatLng(e.latlng)
                .openOn(map);

            // Add event listeners to buttons inside the click event handler
            L.DomEvent.on(startBtn, 'click', function() {
                control.spliceWaypoints(0, 1, e.latlng);  // Update the start waypoint
                map.closePopup();
                logWaypoints();  // Log and show waypoints after updating
            });

            L.DomEvent.on(destBtn, 'click', function() {
                control.spliceWaypoints(control.getWaypoints().length - 1, 1, e.latlng);  // Update the destination waypoint
                map.closePopup();
                logWaypoints();  // Log and show waypoints after updating
            });

            logWaypoints();  // Log and show waypoints every time the map is clicked
        });