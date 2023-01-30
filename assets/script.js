var APIKey = "4b56aeae0df9855091bff3b50acba3bc";
var cities = [];
var today = $('#today');
var futureWeather = $('#forecast')

// localStorage.setItem("card", JSON.stringify(cards));
getSavedCities = JSON.parse(localStorage.getItem(today));
console.log(getSavedCities);
today.text(getSavedCities);

// Function to find the lat and lon with the name of the city
function getCitybyName() {

    var city = $(this).attr("data-name");
    // URL to get the lat and lon of a city
    var cityURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + APIKey;
    console.log(cityURL);
    // Calls the url and get a respone
    $.ajax({
        url: cityURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        // Calls getCitybyLatLon function
        getCitybyLatLon(response);
    });
}

//Function to get the forecast of a city by using the lat and lon attributes
function getCitybyLatLon(response) {
    // Saves the response of lat in a variable
    var lat = JSON.stringify(response[0].lat);
    // console.log(lat);
    // Saves the response of lon in a variable
    var lon = JSON.stringify(response[0].lon);
    // console.log(lon);
    // URL to get the forecast using the saved variables lat and lon
    var queryURL = "http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;
    console.log(queryURL);
    // Calls the url and get a response
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (result) {
        console.log(result);
        // Get the city name on the result
        var cityName = result.city.name;
        // Get the icon url to be displayed with the cityname
        var icon = result.list[0].weather[0].icon;
        // Icon url
        var iconURL = "http://openweathermap.org/img/wn/" + icon + ".png";
        // Add a img tag and set to the src of the image the iconURL
        var iconImg = $('<img>').attr("src", iconURL);
        // Display the city name with the date and the icon
        var h2Tag = $('<h2>').text(cityName + " (" + moment().format('D/MM/Y') + ")");
        console.log(h2Tag);
        // Get and display the temperature and convert it from K to C
        var tempC = result.list[0].main.temp - 273.15;
        var pOne = $("<p>").text("Temp: " + tempC.toFixed(2) + "℃");
        // Get and display the wind speed
        var wind = result.list[0].wind.speed;
        var pTwo = $('<p>').text("Wind: " + wind + " KPH");
        // Get and display the humidity
        var humidity = result.list[0].main.humidity;
        var pThree = $('<p>').text("Humidity: " + humidity + "%");
        // Append all the tags to the id today
        today.addClass("card");

        today.append(h2Tag);
        h2Tag.append(iconImg);
        today.append(pOne);
        today.append(pTwo);
        today.append(pThree);

        futureDayForecast(result);
    })
}

function futureDayForecast(result) {

    var forecast = $('<h4>').text("5-Day Forecast:");

    for (var i = 7; i < result.list.length; i += 8) {
        var futureDate = $('<h5>').text(moment.unix(result.list[i].dt).format("D/MM/Y"));
        var kToC = result.list[i].main.temp - 273.15;
        var futureTemp = $('<div>').text("Temp: " + kToC.toFixed(2) + "℃");

        var futureWind = $('<div>').text("Wind: " + result.list[i].wind.speed + " KPH");

        var futureHumidity = $('<div>').text("Humidity: " + result.list[i].main.humidity + "%");

        var futureIcon = result.list[i].weather[0].icon;
        var futureiIconURL = "http://openweathermap.org/img/wn/" + futureIcon + "@2x.png";
        var futureForecastIcon = $('<img>').attr("src", futureiIconURL);


        futureWeather.prepend(forecast);
        var cards = $('<div>').addClass("card").appendTo(futureWeather);
        var cardBody = $('<div>').addClass("card-body").appendTo(cards);

        $(futureDate).addClass("card-title").appendTo(cardBody);
        $(futureForecastIcon).appendTo(cardBody)
        $(futureTemp).addClass('card-text').appendTo(cardBody);
        $(futureWind).addClass('card-text').appendTo(cardBody);
        $(futureHumidity).addClass('card-text').appendTo(cardBody);

    }

}


// Function to create buttons for each city searched
function renderButtons() {
    // This will delete the prior movies so the there won't appear repeated buttons
    $("#history").empty();
    $("#today-view").empty();

    // Loops through the array of citites
    for (var i = 0; i < cities.length; i++) {
        // This will dynamicaly generate buttons for each movie in the array 
        var btnHistory = $('<button>');
        // Adds a class of city-btn to the button
        btnHistory.addClass("city-btn");
        // Adds a data-attribute
        btnHistory.attr("data-name", cities[i]);
        //Provides the initial button text
        btnHistory.text(cities[i]);
        // Adds the button to the history
        $("#history").append(btnHistory);
        $('#today-view').append(document.querySelectorAll("card"));

        // localStorage.setItem("city-btn", JSON.stringify(cities));

    }
}


// On click event that will save the searched city on the variables cities
$('#search-button').on('click', function (event) {
    event.preventDefault();
    // Grabs input from the textbox
    var city = $('#search-input').val().trim();

    // Clear out the value in the input field
    $('#search-input').val("");

    // Clear out the input when search button is clicked
    today.text("");
    futureWeather.text("");

    // Adding city from the textbox to the array cities
    cities.push(city);
    // Will call renderButtons which handles the processing of city array.

    renderButtons();
});


// Adds a click event listener to all elements with a class of "city-btn"
$(document).on("click", ".city-btn", getCitybyName);



renderButtons();
