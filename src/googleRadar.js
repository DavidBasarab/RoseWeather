var MERCATOR_RANGE = 256;

function bound(value, opt_min, opt_max) {
    if (opt_min != null) value = Math.max(value, opt_min);
    if (opt_max != null) value = Math.min(value, opt_max);
    return value;
}

function degreesToRadians(deg) {
    return deg * (Math.PI / 180);
}

function radiansToDegrees(rad) {
    return rad / (Math.PI / 180);
}

function MercatorProjection() {
    this.pixelOrigin_ = new google.maps.Point( MERCATOR_RANGE / 2, MERCATOR_RANGE / 2);
    this.pixelsPerLonDegree_ = MERCATOR_RANGE / 360;
    this.pixelsPerLonRadian_ = MERCATOR_RANGE / (2 * Math.PI);
};

MercatorProjection.prototype.fromLatLngToPoint = function(latLng, opt_point) {
    var me = this;

    var point = opt_point || new google.maps.Point(0, 0);

    var origin = me.pixelOrigin_;
    point.x = origin.x + latLng.lng() * me.pixelsPerLonDegree_;
    // NOTE(appleton): Truncating to 0.9999 effectively limits latitude to
    // 89.189.  This is about a third of a tile past the edge of the world tile.
    var siny = bound(Math.sin(degreesToRadians(latLng.lat())), -0.9999, 0.9999);
    point.y = origin.y + 0.5 * Math.log((1 + siny) / (1 - siny)) * -me.pixelsPerLonRadian_;
    return point;
};

MercatorProjection.prototype.fromPointToLatLng = function(point) {
    var me = this;

    var origin = me.pixelOrigin_;
    var lng = (point.x - origin.x) / me.pixelsPerLonDegree_;
    var latRadians = (point.y - origin.y) / -me.pixelsPerLonRadian_;
    var lat = radiansToDegrees(2 * Math.atan(Math.exp(latRadians)) - Math.PI / 2);
    return new google.maps.LatLng(lat, lng);
};

//pixelCoordinate = worldCoordinate * Math.pow(2,zoomLevel)

function getCorners(center,zoom,mapWidth,mapHeight){
    var scale = Math.pow(2,zoom);

    var centerPx = proj.fromLatLngToPoint(center);

    var SWPoint = {x: (centerPx.x -(mapWidth/2)/ scale) , y: (centerPx.y + (mapHeight/2)/ scale)};

    var SWLatLon = proj.fromPointToLatLng(SWPoint);

    console.log('SW: ' + SWLatLon);

    var NEPoint = {x: (centerPx.x +(mapWidth/2)/ scale) , y: (centerPx.y - (mapHeight/2)/ scale)};

    var NELatLon = proj.fromPointToLatLng(NEPoint);

    console.log(' NE: '+ NELatLon);

    return {
        NELatLon : {
            lat : NELatLon.lat(),
            lng : NELatLon.lng()
        },
        SWLatLon : {
            lat : SWLatLon.lat(),
            lng : SWLatLon.lng()
        }
    }
}

var proj = new MercatorProjection();
var G = google.maps;
var centerPoint = new G.LatLng(33.365736, -84.432969);
var zoom = 10;
var width = 933;
var height = 840;

function refreshRadar() {
    var corners = getCorners(centerPoint,zoom,933,840);

    console.log(JSON.stringify(corners));

    var googleUrl = 'http://maps.googleapis.com/maps/api/staticmap?center=33.365736,-84.432969&zoom=' + zoom + '&size=' + width + 'x' + height +'&maptype=roadmap&key=AIzaSyDxuhw4SRRQogAUwWZV2-PLwNqKHggOKpE&markers=color:red|size:small|33.365736,-84.432969';

    console.log(googleUrl);

    var radarUrl = 'http://api.wunderground.com/api/0b7c673843d8c122/animatedradar/lang:EN/image.gif?maxlat=' + corners.NELatLon.lat + '&maxlon=' + corners.NELatLon.lng + '&minlat=' + corners.SWLatLon.lat +'&minlon=' + corners.SWLatLon.lng +'&width=' + width + '&height=' + height + '&newmaps=0&reproj.automerc=1&num=5&delay=25&timelabel=1&timelabel.y=10&rainsnow=1&smooth=1&radar_bitmap=1&xnoclutter=1&xnoclutter_mask=1&cors=1';

    console.log(radarUrl);

    $('#map').attr('src', googleUrl);
    $('#overlay').attr('src', radarUrl);
}