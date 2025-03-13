document.addEventListener("DOMContentLoaded", function () {
    // Initialize map with a default view (College Station)
    var map = L.map('map').setView([30.624614807057483, -96.34535900494437], 15);

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(map);

    // Locate user and zoom to location
    function onLocationFound(e) {
        var radius = e.accuracy / 2;

        L.marker(e.latlng).addTo(map)
            .bindPopup("You are within " + radius + " meters from this point").openPopup();

        L.circle(e.latlng, { radius: radius }).addTo(map);

        map.setView(e.latlng, 14); // Zoom to user's location
    }

    function onLocationError(e) {
        L.popup()
            .setLatLng([30.617, -96.336])
            .setContent("Location access denied. Defaulting to College Station.")
            .openOn(map);
        map.setView([30.617, -96.336], 10);
    }

    map.on('locationfound', onLocationFound);
    map.on('locationerror', onLocationError);
    map.locate({ setView: true, maxZoom: 10 });

    // Custom Leaflet icons
    var CustomIcon = L.Icon.extend({
        options: {
            iconSize: [38, 95],
            shadowSize: [50, 64],
            iconAnchor: [22, 94],
            shadowAnchor: [4, 62],
            popupAnchor: [-3, -76],
            shadowUrl: 'https://leafletjs.com/examples/custom-icons/leaf-shadow.png'
        }
    });

    // Custom icons for O&M and Academic Building
    var omIcon = new CustomIcon({ iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-green.png' });
    var academicIcon = new CustomIcon({ iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-red.png' });
    var evansIcon = new CustomIcon({ iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-orange.png' });

    // Markers for O&M and Academic Building
    L.marker([30.61772696293997, -96.3367037438514], { icon: omIcon }).bindPopup("O&M Building - David G. Eller Oceanography and Meteorology Building").addTo(map);
    L.marker([30.615759410076507, -96.34079065405959], { icon: academicIcon }).bindPopup("Academic Building - Historic TAMU landmark").addTo(map);
    L.marker([30.616798150608545, -96.33926713880457], { icon: evansIcon }).bindPopup("Evans Library - Sterling C. Evans Library & Annex").addTo(map);

    // Draw a circle around Kyle Field
    L.circle([30.6102, -96.3406], {
        color: 'blue',
        fillColor: '#30f',
        fillOpacity: 0.5,
        radius: 300
    }).addTo(map).bindPopup("Kyle Field - Home of the Aggies!");

    var polygon = L.polygon([
        [30.62316692765269, -96.32967409470993],
        [30.61966821909145, -96.33478359147547],
        [30.618583294709325, -96.33441646832769],
        [30.61723095869698, -96.33500232780723],
        [30.616875812147597, -96.33502212877703],
        [30.61318769348246, -96.33168510418295],
        [30.6123203469797, -96.3313835484203],
        [30.612267120861375, -96.3310151304709],
        [30.618518092796748, -96.3237758491225]
    ]).addTo(map);
    polygon.bindPopup("The Golf Club at Texas A&M.");

    // Click event to show coordinates
    var popup = L.popup();
    function onMapClick(e) {
        popup
            .setLatLng(e.latlng)
            .setContent("Coordinates: " + e.latlng.toString())
            .openOn(map);
    }

    map.on('click', onMapClick);
});