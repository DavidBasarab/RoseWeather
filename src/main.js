var hourly10DayUrl = 'http://api.wunderground.com/api/0b7c673843d8c122/conditions/astronomy/hourly10day/alerts/forecast10day/lang:EN/q/33.365736,-84.432969.json';
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

    function loadDailyForecast(result) {
        var dayArray = [
            // {
            //     day : "Monday",
            //     hiTemp : 65,
            //     loTemp : 21,
            //     conditions : 'Sunny',
            //     rainChance : 0,
            //     conditionUrl : 'http://icons.wxug.com/i/c/v3/cloudy.svg'
            // },
            // {
            //     day : "Tuesday",
            //     hiTemp : 32,
            //     loTemp : 5,
            //     conditions : 'Snowy',
            //     rainChance : 95,
            //     conditionUrl : 'http://icons.wxug.com/i/c/v3/nt_cloudy.svg'
            // },
            // {
            //     day : "Wednesday",
            //     hiTemp : 43,
            //     loTemp : 40,
            //     conditions : 'Cloudy',
            //     rainChance : 50,
            //     conditionUrl : 'http://icons.wxug.com/i/c/v3/cloudy.svg'
            // }
        ];

        addDailyForecast(dayArray, result, 1);
        addDailyForecast(dayArray, result, 2);
        addDailyForecast(dayArray, result, 3);

        $('#dailyWeatherTemplate').tmpl(dayArray).appendTo('#dailyRowContainer');
    }

    function addDailyForecast(dayArray, result, index) {
        dayArray.push({
            day : result.forecast.simpleforecast.forecastday[index].date.weekday,
            hiTemp : result.forecast.simpleforecast.forecastday[index].high.fahrenheit,
            loTemp : result.forecast.simpleforecast.forecastday[index].low.fahrenheit,
            conditions : result.forecast.simpleforecast.forecastday[index].conditions,
            rainChance : result.forecast.simpleforecast.forecastday[index].pop,
            conditionUrl : getConditionIconUrl(result.forecast.simpleforecast.forecastday[index].icon_url, result.forecast.simpleforecast.forecastday[1].icon)
        });
    }

    function getConditionIconUrl(startIconUrl, icon)
    {
        //http://icons.wxug.com/i/c/v4/clear.svg
        var showNight = startIconUrl.includes("nt_");

        var finalUrlIcon  = 'https://icons.wxug.com/i/c/v3/';

        if(showNight) {
            finalUrlIcon = finalUrlIcon + 'nt_';
        }

        finalUrlIcon = finalUrlIcon + icon + '.svg';

        return finalUrlIcon;
    }

    function refreshWeatherData() {
        getWeatherData().done(function (result) {
            console.log('got weather data');

            //"http://icons.wxug.com/i/c/k/nt_partlycloudy.gif

            $('#currentTemp').text(result.current_observation.temp_f);

            $('#currentConditions').text(result.current_observation.weather);

            $('#currentConditionsIcon').attr('src', getConditionIconUrl(result.current_observation.icon_url, result.current_observation.icon));

            // Need to find RAIN % for current hour
            var currentHour = result.hourly_forecast[0];

            $('#rainPercent').text(currentHour.pop);

            $('#sunRise').text(result.sun_phase.sunrise.hour + ':' + result.sun_phase.sunrise.minute + ' AM');

            $('#sunSet').text((result.sun_phase.sunset.hour - 12) + ':' + result.sun_phase.sunset.minute + ' PM');

            $('#hiTemp').text(result.forecast.simpleforecast.forecastday[0].high.fahrenheit);
            $('#loTemp').text(result.forecast.simpleforecast.forecastday[0].low.fahrenheit);

            loadDailyForecast(result);

            window.setTimeout(refreshWeatherData, 600000);

        }).fail(function (result) {
            console.log('Error: ' + result.responseText);
        });
    }

    refreshWeatherData();

});