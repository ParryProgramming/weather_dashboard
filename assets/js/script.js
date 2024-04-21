const APIKey = "c24db44d1844645a72452a97b36430be";

async function getLatLon(cityName) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    cityName
  )}`;

  const resp = await fetch(url);

  const data = await resp.json();

  return [data[0].lat, data[0].lon];
}

async function get_data(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKey}`;

  const resp = await fetch(url);

  let data = await resp.json();

  data = filter_data(data);

  return data;
}

function filter_data(data) {
  const filteredData = {
    ...data,
    list: [],
  };

  const groupedData = {};

  data.list.forEach((item) => {
    const date = item.dt_txt.split(" ")[0];
    if (!groupedData[date]) {
      groupedData[date] = item;
    } else {
      const existingTime = new Date(groupedData[date].dt_txt);
      const currentTime = new Date(item.dt_txt);
      if (currentTime < existingTime) {
        groupedData[date] = item;
      }
    }
  });

  for (const date in groupedData) {
    filteredData.list.push(groupedData[date]);
  }

  return filteredData;
}

// main 

const btn_search = document.getElementById("btn_search");
const city_list = document.querySelector(".city_list");
const current_day_container = document.querySelector(".currentDay");
const five_day_container = document.querySelector(".weatherCards");
const txt_search = document.getElementById("search");

// handle onload

window.onload = () => {
  let btn_html = "";

  const list = JSON.parse(localStorage.getItem("list"));

  list?.forEach((city) => {
    btn_html += `
        <button class="city_btn" onclick="handle_city_btn('${city}')">${city}</button>
        
        `;
  });

  city_list.innerHTML = btn_html;
};

// handle search btn click
btn_search.onclick = async () => {
  const city = txt_search.value;
  if (!city) {
    alert("please enter city name");
    return;
  }

  try {
    const data = await get_data(city);

    // show current day

    let curr_html = `<div class="cardHeading">
        <h2 class="heading">${data.city.name} ${formatDate(
      data.list[0].dt_txt
    )} 
    <img src="http://openweathermap.org/img/w/${
      data.list[0].weather[0].icon
    }.png" />
    
    </h2>
        <div class="icon">
        <img src="http://openweathermap.org/img/w/${
          data.list[0].weather[0].icon
        }.png" />
        
        </div>
      </div>
      <p class="text">Temp:${data.list[0].main.temp} F</p>
      <p class="text">Wind: ${data.list[0].wind.speed} MPH</p>
      <p class="text">Humidity ${data.list[0].main.humidity} %</p>`;

    let card_html = "";

    for (let i = 1; i <= 5; i++)
      [
        (card_html += ` <div class="weatherCard">
        <h4 class="cardHeading">${formatDate(data.list[i].dt_txt)}</h4>
        <div class="icon">
        <img src="http://openweathermap.org/img/w/${
          data.list[i].weather[0].icon
        }.png" />
        </div>
        <p class="text">Temp:${data.list[i].main.temp} F</p>
        <p class="text">Wind: ${data.list[i].wind.speed} MPH</p>
        <p class="text">Humidity ${data.list[i].main.humidity} %</p>
      </div>`),
      ];

    current_day_container.innerHTML = curr_html;
    five_day_container.innerHTML = card_html;

    // store in local storage
    add_to_storage(city);
  } catch (error) {
    console.log(error);
  }
};

function formatDate(dateString) {
  const [datePart, timePart] = dateString.split(" ");

  const [year, month, day] = datePart.split("-");

  return `${day}/${month}/${year}`;
}

function handle_city_btn(city) {
  txt_search.value = city;

  btn_search.click();
}

function add_to_storage(city) {
  const prev_city = JSON.parse(localStorage.getItem("list")) || [];

  if (!prev_city.includes(city)) {
    localStorage.setItem("list", JSON.stringify([...prev_city, city]));

    const btn_html = `
        <button class="city_btn" onclick="handle_city_btn('${city}')">${city}</button>
        
        `;

    city_list.innerHTML += btn_html;
  }
}
