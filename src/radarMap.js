var map, animatedLayer;

//Weather tile url from Iowa Environmental Mesonet (IEM): http://mesonet.agron.iastate.edu/ogc/
var urlTemplate = 'http://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-{timestamp}/{zoom}/{x}/{y}.png';

//The time stamps values for the IEM service for the last 50 minutes broken up into 5 minute increments.
var timestamps = ['900913-m50m', '900913-m45m', '900913-m40m', '900913-m35m', '900913-m30m', '900913-m25m', '900913-m20m', '900913-m15m', '900913-m10m', '900913-m05m', '900913'];

function GetMap() {
    map = new Microsoft.Maps.Map('#myMap', {
        credentials: 'AukiFJufqy5nuE7sRh7ojpSz5EpL2zEHIHiFJryHdayJeiVDJ-x3DescRvsqLVDe',
        center: new Microsoft.Maps.Location(33.365736, -84.432969),
        zoom: 10,
        showZoomButtons: false,
        showLocateMeButton: false,
        showMapTypeSelector: false
    });

    var tileSources = [];

    //Create a tile source for each time stamp.
    for (var i = 0; i < timestamps.length; i++) {
        var tileSource = new Microsoft.Maps.TileSource({
            uriConstructor: urlTemplate.replace('{timestamp}', timestamps[i])
        });
        tileSources.push(tileSource);
    }

    //Create the animated tile layer and add it to the map.
    animatedLayer = new Microsoft.Maps.AnimatedTileLayer({
        mercator: tileSources,
        frameRate: 500
    });

    map.layers.insert(animatedLayer);

    var center = map.getCenter();

    //Create custom Pushpin
    var pin = new Microsoft.Maps.Pushpin(center, {
        color: 'red'
    });

    //Add the pushpin to the map
    map.entities.push(pin);
}