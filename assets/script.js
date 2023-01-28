var APIKey = "4b56aeae0df9855091bff3b50acba3bc";
var cities = [];

function displayCitiesInfo() {
    // Get the lat and lon by city name
    var city = $(this).attr("data-name");
    var cityURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + APIKey;
    // Get the city using the variable city and cityURL


    // var queryURL = "http://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=" + APIKey;
    console.log(cityURL);
    // console.log(queryURL);
    $.ajax({
        url: cityURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        var lat = JSON.parse(response.name);
        var lot = (this.name);
        console.log(lat.name);
        console.log(lot);
        document.getElementById("today").innerHTML = lat.name;
    });
}

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
$(document).on("click", ".city-btn", displayCitiesInfo);

renderButtons();