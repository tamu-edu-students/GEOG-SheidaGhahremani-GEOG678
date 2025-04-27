// Initialize the map
var map = L.map('map').setView([30.62798, -96.33441], 12); // Brazos County Center

// Add OpenStreetMap basemap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Load Flu Vaccination & Testing Centers Data
fetch("Brazos_boundary.geojson")
    .then(response => response.json())
    .then(data => {
        if (!data || !data.features) {
            console.error("Invalid GeoJSON structure:", data);
            return;
        }
        L.geoJSON(data, {
            style: {
                color: "Green",
                weight: 3,
                opacity: 1,
                fillColor: "Lightgreen",
                fillOpacity: 0.1
            }
        }).addTo(map);
    })
    .catch(error => console.error("Error loading GeoJSON:", error));

// Define a custom icon
var customIcon = L.icon({
    iconUrl: 'Flu vaccination center locator symbol with red color and injection symbol, no background.png',
    iconSize: [40, 50],
    iconAnchor: [15, 40],
    popupAnchor: [0, -35]
});

// Fetch vaccination centers from JSON file
var centers = [];
fetch("vaccinationcenters.json")
    .then(response => response.json())
    .then(vaccinationCenters => {
        centers = vaccinationCenters;
        centers.forEach(center => {
            if (center.latitude && center.longitude) {
                L.marker([center.latitude, center.longitude], { icon: customIcon })
                    .addTo(map)
                    .bindPopup(
                        `<b>${center.name}</b><br>${center.address}<br>Hours: ${center.hours}<br>Phone: <a href="tel:${center.phone}">${center.phone}</a><br>Website: <a href="${center.website}" target="_blank">Visit Website</a>`
                    );
            } else {
                console.error(`Missing coordinates for: ${center.name}`);
            }
        });
    })
    .catch(error => console.error("Error loading vaccination centers JSON:", error));

L.esri.Geocoding.geosearch().addTo(map);

var markers = [];

function getUserLocation() {
    navigator.geolocation.getCurrentPosition(position => {
        let userLat = position.coords.latitude;
        let userLng = position.coords.longitude;

        L.marker([userLat, userLng])
            .addTo(map)
            .bindPopup("You are here").openPopup();

        findNearestCenter(userLat, userLng);
    });
}

function findNearestCenter(userLat, userLng) {
    let nearest = null;
    let minDistance = Infinity;

    centers.forEach(center => {
        let distance = Math.sqrt(Math.pow(center.latitude - userLat, 2) + Math.pow(center.longitude - userLng, 2));
        if (distance < minDistance) {
            minDistance = distance;
            nearest = center;
        }
    });

    if (nearest) {
        L.Routing.control({
            waypoints: [
                L.latLng(userLat, userLng),
                L.latLng(nearest.latitude, nearest.longitude)
            ]
        }).addTo(map);
    }
}

function searchCenter() {
    let query = document.getElementById("searchBox").value.toLowerCase();
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    let results = centers.filter(c => c.name.toLowerCase().includes(query));

    if (results.length > 0) {
        let selectedCenter = results[0];

        let marker = L.marker([selectedCenter.latitude, selectedCenter.longitude])
            .addTo(map)
            .bindPopup(`<b>${selectedCenter.name}</b>`);
        markers.push(marker);

        map.setView([selectedCenter.latitude, selectedCenter.longitude], 14);

        // Show directions if user location is available
        navigator.geolocation.getCurrentPosition(position => {
            let userLat = position.coords.latitude;
            let userLng = position.coords.longitude;

            L.Routing.control({
                waypoints: [
                    L.latLng(userLat, userLng),
                    L.latLng(selectedCenter.latitude, selectedCenter.longitude)
                ]
            }).addTo(map);
        });
    }
}
