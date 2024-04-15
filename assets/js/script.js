let searchList = JSON.parse(localStorage.getItem("#results"));
let nextSearch = JSON.parse(localStorage.getItem("new-search"));

let apiKey = "c24db44d1844645a72452a97b36430be";
let city;
let weatherElement = document.getElementById('currentWeather');
const searchInput = document.getElementById('search');
let forecast = document.getElementById('forecastContainer')

const formSubmitHandler = function (event) {
    const city = searchInput.value

    if (city) {
        search(city);

        searchInput.value = ''
    } else {
        alert('please enter city')
    }
};

function search(city) {

    const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`
}

fetch(apiUrl)
    .then(function (response) {
        if (response.ok) {

            response.json()
                .then(function (data) {

                    console.log(data);
                    displayWeather(data)
                    get5dayForecast(city)
                })
        } else {

            alert(`error: ${response.status.statusText}`);
        }
    })

const displayWeather = function (data) {
    const cityNameEl = document.createElement('h2');
    const cityTempEl = document.createElement('h3');
    const cityWindEl = document.createElement('h3');
    const cityHumidity = document.createElement('h3');

    const date = dayjs().format('MM/DD/YYYY');
    console.log(data)
    const iconPath = data.weather[0].icon;
    const icon = weatherIcon(iconPath);

    cityNameEl.textContent = `${data.name} (${date}) ${icon}`;
    const cityTemp = (data.main.temp = 273.15) * (9 / 5) + 32;
    cityTempEl.textContent = `Temp: ${cityTemp.toFixed(2)} F`;
    cityWindEl.textContent = `Wind ${data.wind.speed} MPH`;
    cityHumidityEl.textContent = `Humidity ${data.main.humidity} %`;

    weatherElement.appendChild(cityNameEl);
    weatherElement.appendChild(cityTempEl);
    weatherElement.appendChild(cityWindEl);
    weatherElement.appendChild(cityHumidityEl);

}

function addToHistory() {

    const searchCity = document.getElementById('searchHistory');
}

const forecastSearch = function (city) {
    const queryURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`

    fetch(queryURL)
        .then(function (response) {

            if (response.ok) {
                response.json()
                    .then(function (data) {

                        console.log(data);

                        displayForecast(data)
                    })
            } else {
                alert(`error: ${resopnse.statusText}`);
            }

        })
}

const displayForecast = function (data) {
    for (let i = 1; i <= 5; i++) {

        const forecastCard = document.createElement('div')
        forecastCard.setAttribute('id', 'card')

        const cityDateEl = document.createElement('h4')
        const iconEl = document.createElement('h5')
        const cityTempEl = document.createElement('h5')
        const cityWindEl = document.createElement('h5')
        const cityHumidityEl = document.createElement('h5')

        const date = forecastDate(i)
        const icon = forecastIcon(data, i)

        cityDateEl.textContent = `${date}`;
        iconEl.textContent = icon;

        const cityTemp = (data.list[i].main.temp - 273.15) * (9 / 5) + 32;
        cityTempEl.textContent = `Temp: ${cityTemp.toFixed(2)} F`;
        cityWindEl.textContent = `Wind: ${data.list[i].wind.speed} MPH`;
        cityHumidityEl.textContent = `Humidity: ${data.list[i].main.humidity} %`;

        forecastCard.appendChild(cityDateEl);
        forecastCard.appendChild(iconEl);
        forecastCard.appendChild(cityTempEl);
        forecastCard.appendChild(cityWindEl);
        forecastCard.appendChild(cityHumidityEl);

        forecastElement.appendChild(forecastCard);



    }
}