
// Foursquare API Info
    const clientId = '5QI4MQJ1D03CFQNC3FYRWX02CPMPEAVVCYMUGMECESCJ5K4K';
    const clientSecret = 'N2QBUXA13LRQHUDZ1TUQBPPAZYCLOMGF1CKBUEEBBT0XD41O';
    const url = 'https://api.foursquare.com/v2/venues/explore?near=';

    // OpenWeather Info
    const openWeatherKey = '4f3dd54a102ba7d1e4ba5a41736dc560';
    const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather';

    // Page Elements
    const $input = $('#city');
    const $submit = $('#button');
    const $destination = $('#destination');
    const $container = $('.container');
    const $venueDivs = [$("#venue1"), $("#venue2"), $("#venue3"), $("#venue4")];
    const $weatherDiv = $("#weather1");
    const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Add AJAX functions:
    //request information from the Foursquare API
    const getVenues = async () => {
        const city = $input.val();
        const urlToFetch = `${url}${city}&limit=10&client_id=${clientId}&client_secret=${clientSecret}&v=20200611`;
        try {
            const response = await fetch(urlToFetch);
            if (response.ok) {
                console.log(response.url);
                const jsonResponse = await response.json();
                console.log(jsonResponse);
                const venues = jsonResponse.response.groups[0].items.map(item => item.venue);
                console.log(venues);
                return venues;
            }
        } catch(error) {
            console.log(error);
        }
    }

    //request information from the OpenWeather API
    const getForecast = async () => {
        const urlToFetch = `${weatherUrl}?&q=${$input.val()}&APPID=${openWeatherKey}`;
        try {
            const response = await fetch(urlToFetch);
            if (response.ok) {
                const jsonResponse = await response.json();
                console.log(jsonResponse);
                return jsonResponse;
            }
        } catch(error) {
        console.log(error);
        }
    }

    const createVenueHTML = (name, location, iconSource) => {
        return `<h2 >${name}</h2>
        <div><img class="venueimage" src="${iconSource}"/></div>
        <h3 >Address:</h3>
        <p >${location.address}</p>
        <p >${location.city}</p>
        <p >${location.country}</p>`;
    }
    
    const createWeatherHTML = (currentDay) => {
        console.log(currentDay)
        return `<h2 >${weekDays[(new Date()).getDay()]}</h2>
            <h2 >Temperature: ${kelvinToCelsius(currentDay.main.temp)}&deg;C</h2>
            <h2 >Condition: ${currentDay.weather[0].description}</h2>
            <div ><img src="https://openweathermap.org/img/wn/${currentDay.weather[0].icon}@2x.png"></div>
            <h2 >Feels like:  ${kelvinToCelsius(currentDay.main.feels_like)}&deg;C</h2>
            <h2 >Max Temperature:  ${kelvinToCelsius(currentDay.main.temp_max)}&deg;C</h2>
            <h2 >Min Temperature:  ${kelvinToCelsius(currentDay.main.temp_min)}&deg;C</h2>`
    }
    
    const kelvinToCelsius = k => (k - 273.15).toFixed(0);

    // Render functions
    const renderVenues = (venues) => {
        $venueDivs.forEach(($venue, index) => {
                //randomize which places are added to the page
                let randomPlaceFromList = Math.floor(Math.random() * (10 - index));             
                const venue = venues[randomPlaceFromList];
                const venueIcon = venue.categories[0].icon;
                console.log(venueIcon);
                const venueImgSrc = `${venueIcon.prefix}bg_64${venueIcon.suffix}`;
                let venueContent = createVenueHTML(venue.name, venue.location, venueImgSrc);
                $venue.append(venueContent);
                venues.splice(randomPlaceFromList, 1);
                console.log(venues);
        });
            $destination.append(`<h2 >${venues[0].location.city}</h2>`);
        }

    const renderForecast = (day) => {
        const weatherContent = createWeatherHTML(day);
        $weatherDiv.append(weatherContent);
    };

    //main
    const executeSearch = () => {
        $venueDivs.forEach(venue => venue.empty());
        $weatherDiv.empty();
        $destination.empty();
        $container.css("visibility", "visible");
        getVenues().then(venues => {return renderVenues(venues)});
        getForecast().then(forecast => {return renderForecast(forecast)});
        return false;
    }

    $submit.click(executeSearch)