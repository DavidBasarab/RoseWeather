function loadRadarMap() {

    console.log('Loading Radar Map');

    $('#map-canvas').html('');

    // Configure Aeris API keys
    aeris.config.set({
        apiId: 'Dxb99XHofRen5ocF6w26T',
        apiSecret: 'xJGhqVqhMP7JuySRMl9DryUPZwvc9b3k3AzSgPD8'
    });

// Create the map, where 'map-canvas' is the id of an HTML element.
    var map = new aeris.maps.Map('map-canvas', {
        zoom: 10,
        center: [33.365736, -84.432969]
    });

// Create 'radar' layer
    var radar = new aeris.maps.layers.AerisTile({
        tileType: 'radar',
        zIndex: 4,
        map: map
    });

// Create 'admin-cities' layer


// Create 'alerts' layer

    var marker = new aeris.maps.markers.Marker({
        position: [33.365736, -84.432969]
    });

    marker.setMap(map);

// Create the animation
// See https://github.com/aerisweather/aerisjs/blob/master/examples/animations/sync.html
// for a more complete usage demonstration
//     var animation = new aeris.maps.animations.AnimationSync([
//         radar,
//         alerts
//     ], {
//         from: Date.now() - 1000 * 60 * 60 * .25,    // 2 hours ago
//         to: Date.now()
//     });

// Display the current time of the animation
// A 'change:times' event is triggered
// with a date object corresponding to the
// current animation frame.
// animation.on('change:time', function(date) {
//     // Update the hh:mm display
//     var formattedTime = date.toTimeString().replace(/.*(\d{2}:\d{2})(:\d{2}).*/, "$1");
//     $('#currentTime').text(formattedTime);
//     // Update the position of the time range input
//     $('#time').val(date.getTime());
// });

// Start the animation
//     animation.start();
}

