var hourly10DayUrl = 'http://api.wunderground.com/api/0b7c673843d8c122/conditions/astronomy/hourly10day/forecast10day/lang:EN/q/33.365736,-84.432969.json';
var googleMapImageUrl = 'http://maps.googleapis.com/maps/api/staticmap?center=33.365736,-84.432969&zoom=10&size=933x840&maptype=hybrid&markers=color:red|size:small|33.365736,-84.432969';
var radarImageUrl = 'http://api.wunderground.com/api/0b7c673843d8c122/animatedradar/lang:EN/image.gif?maxlat=40.7209201431&maxlon=-74.1827248594&minlat=25.3324717742&minlon=-94.6832131406&width=1866&height=1680&newmaps=0&reproj.automerc=1&num=5&delay=25&timelabel=1&timelabel.y=10&rainsnow=1&smooth=1&radar_bitmap=1&xnoclutter=1&xnoclutter_mask=1&cors=1';

$(document).ready(function () {

    function timeNumber() {
        var d = new Date();

        return d.getTime();
    }

    function getWeatherData() {
        return $.ajax({
            type: "GET",
            url: hourly10DayUrl + '?r=' + timeNumber(),
            dataType: 'json'
        });
    }

    getWeatherData().done(function (result) {
        console.log('got weather data');

        var currentTemp = result.current_observation.temp_f;

        $('#currentTemp').text(currentTemp);

    }).fail(function (result) {
        console.log('Error: ' + result.responseText);
    });

});