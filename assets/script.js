var APIKey = "4b56aeae0df9855091bff3b50acba3bc";
var cities = [];
var today = $('#today');

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

        var cityName = result.city.name;
        var h2Tag = $('<h2>').text(cityName + " " + moment().format('D/MM/Y'))
        console.log(h2Tag);

        var tempC = result.list[0].main.temp - 273.15;
        var pOne = $("<p>").text("Temp: " + tempC.toFixed(2) + "℃");
        console.log(pOne);

        var wind = result.list[0].wind.speed;
        var pTwo = $('<p>').text("Wind: " + wind + " KPH");
        console.log(pTwo);

        var humidity = result.list[0].main.humidity;
        var pThree = $('<p>').text("Humidity: " + humidity + "%");
        console.log(pThree)

        today.append(h2Tag);
        today.append(pOne);
        today.append(pTwo);
        today.append(pThree);
    })
}

// Function to create buttons for each city searched
function renderButtons() {
    // This will delete the prior movies so the there won't appear repeated buttons
    $("#history").empty();
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
    }
}

// On click event that will save the searched city on the variables cities
$('#search-button').on('click', function (event) {
    event.preventDefault();
    // Grabs input from the textbox
    var city = $('#search-input').val().trim();

    // Clear out the value in the input field
    $('#search-input').val("");

    // Adding city from the textbox to the array cities
    cities.push(city);

    // Will call renderButtons which handles the processing of city array.
    renderButtons();
});

// Adds a click event listener to all elements with a class of "city-btn"
$(document).on("click", ".city-btn", getCitybyName);

renderButtons();