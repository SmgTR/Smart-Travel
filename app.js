//get user Location

const gps = new Location();

//init Storage
const storage = new Storage();
//get stored location data
const weatherLocation = storage.getLocationData();

const weather = new Weather(weatherLocation.city, weatherLocation.country);

//init ticketmaster

const ticket = new TicketMaster();

//init Google places api

const place = new Google();

const ui = new UI();

//currency
const ex = new Exchange();

//set wiki to work with localStorage

const wiki = new WikiInfo();

wiki.changeWikiCity(weatherLocation.city);
place.changeCity(weatherLocation.city);

getPlace();

getWiki();

ticket.changeLocation("34.05", "-118.24");

getEvents();

preloader();
//

//page__preloader
document
  .querySelector(".page__preloader-layer--2")
  .addEventListener("animationend", isEnd, true);

function isEnd() {
  document.querySelector(".top__nav-description").style.display = "block";
  document.querySelector(".search").style.display = "block";
  document.querySelector("main").style.display = "block";
  document.querySelector(".footer").style.display = "flex";
  document.querySelector(".page__preloader").style.display = "none";
}

//user location
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(position => {
    gps.changeUserLocation(position.coords.latitude, position.coords.longitude);

    function getLocat() {
      gps
        .getLoc()
        .then(results => {
          const responseData = results.results;
          responseData.forEach(n => {
            if (n.components.city !== undefined) {
              city = n.components.city;
            } else {
              city = n.components.town;
            }

            const country = n.components.country_code;

            this.lat = n.geometry.lat;
            this.long = n.geometry.lng;

            //set  weather based on location
            weather.changeWeatherLocation(city, country);
            getWeather();

            weather.setGeo(this.lat, this.long);

            //get week weather, coords are set in getWeather().
            weekWeather();

            //get wiki info with user location
            wiki.changeWikiCity(city);
            getWiki();

            //change currency

            preloader();
          });
        })
        .catch(err => console.log(err));
    }

    getLocat();
  });
}

//google api response
function getPlace() {
  place
    .getPlaces()
    .then(results => {
      ui.google(results);
      console.log(results);
    })
    .catch(err =>
      console.log("Too many requests for free Google API plan. Try again later")
    );
}

//wikipedia api responde

function getWiki() {
  wiki.getWikiInfo().then(results => {
    ui.wiki(results);
  });
}

//get events info

function getEvents() {
  ticket
    .getEvents()
    .then(results => {
      ui.getEvents(results);
    })
    .catch(err => err);
}

document.addEventListener("DOMContentLoaded", getWeather);

function getWeather() {
  weather
    .getWeather()
    .then(results => {
      ui.paint(results);

      ui.itsOk();

      //set week weather coords
      weather.setGeo(results.coord.lat, results.coord.lon);
      weekWeather();
      //sset location for events

      ticket.changeLocation(results.coord.lat, results.coord.lon);

      getEvents();

      place.changeCity(results.name.toLowerCase());
      getPlace();

      preloader();

      //add to last 10
      addPlace(results.name, results.sys.country);

      //reset initial value of calculator to 1
      amountEle_one.value = 1;

      //exchange based on gps class results

      gps.changeUserLocation(results.coord.lat, results.coord.lon);
      gps.getLoc().then(results => {
        let data = results.results;
        data.forEach(e => {
          ex.changeCurrency(e.annotations.currency.iso_code);
        });

        getMoney();
      });
    })
    .catch(err => {
      ui.notFounded();

      ui.newError("Incorrect City name or Country code");

      localStorage.clear();

      clear();
    });
}

//get week weather
function weekWeather() {
  weather
    .weekWeather()
    .then(results => {
      ui.weekWeatherPaint(results);
      // console.log(results);
    })
    .catch(err => console.log(err));
}

//city from inputs

//search architecture
let searchFor = function() {
  const city = document.getElementById("locality").value;
  const country = document.getElementById("country").value;

  if (city !== "" || country !== "") {
    weather.changeWeatherLocation(city, country);

    //get and display weather

    storage.setLocationData(city, country);

    getWeather();

    //change wiki city to input value
    wiki.changeWikiCity(city);
    //get wiki info
    getWiki();

    //get week weather
    weekWeather();
    clear();
  } else {
    ui.newError("Please fill all inputs");
  }
};

document.getElementById("search__btn").addEventListener("click", searchFor);
document.getElementById("locality").addEventListener("keyup", e => {
  setTimeout(function() {
    if (e.keyCode === 13) {
      searchFor();
      clear();
    }
  }, 2000);
});

//clear inputs
function clear() {
  setTimeout(() => {
    locality.value = "";
    country.value = "";
  }, 6000);
}

function preloader() {
  document.querySelector(".preloader").style.display = "block";
  document.querySelector(".flex__container").style.display = "none";
  document.querySelector(".weather").style.display = "none";
  document.querySelector(".google").style.display = "none";
  document.querySelector(".exchange").style.display = "none";
  setTimeout(function() {
    document.querySelector(".exchange").style.display = "flex";

    document.querySelector(".preloader").style.display = "none";
    document.querySelector(".flex__container").style.display = "flex";
    document.querySelector(".weather").style.display = "block";
    document.querySelector(".google").style.display = "block";
  }, 5000);
}

let placeSearch;
let autocomplete;

const componentForm = {
  locality: "short_name",
  country: "short_name"
};

function initAutocomplete() {
  autocomplete = new google.maps.places.Autocomplete(
    document.getElementById("locality"),
    { types: ["(cities)"] }
  );

  autocomplete.setFields(["address_component"]);

  autocomplete.addListener("place_changed", fillInAddress);
}

function fillInAddress() {
  const place = autocomplete.getPlace();

  for (const component in componentForm) {
    document.getElementById(component).value = "";
    document.getElementById(component).disabled = false;
  }

  for (const component of place.address_components) {
    const addressType = component.types[0];

    if (componentForm[addressType]) {
      const val = component[componentForm[addressType]];
      document.getElementById(addressType).value = val;
    }
  }
}

document.addEventListener("DOMContentLoaded", initAutocomplete);

//hide up arrow while on top of site, ticket section is used as a point of start
window.onscroll = function(ev) {
  if (window.scrollY >= document.querySelector(".ticket").offsetHeight) {
    document.querySelector(".up").style.visibility = "visible";
  } else {
    document.querySelector(".up").style.visibility = "hidden";
  }
};

//add places to array and display on last__places bar
let cityArr = [];
let countryArr = [];

function addPlace(city, country) {
  //if theres no on list add new city to start and country
  if (
    (cityArr.length <= 10) & !cityArr.includes(city) &&
    countryArr.length <= 10
  ) {
    cityArr.unshift(city);
    countryArr.unshift(country);
  }

  let html = '<h3 class="last__places-title">Last 10 places:</h3>';

  let id = 0;

  cityArr.forEach(function(e) {
    //logic to delete first item from array if 11 element is coming.
    if (cityArr.length === 11 || countryArr.length === 11) {
      cityArr.pop();
      countryArr.pop();
    }
    html += `
      <li class="last__places-list--item" id="${id}">${e}</li>
    `;
  });
  document.querySelector(".last__places-list").innerHTML = html;
}

//function change location at click
document
  .querySelector(".last__places-list")
  .addEventListener("click", lastPlacesChange);

function lastPlacesChange(e) {
  if (e.target.classList.contains("last__places-list--item")) {
    const city = e.target.textContent.toLowerCase();

    const country = e.target.id;

    weather.changeWeatherLocation(city, countryArr[country - 1]);

    getWeather();

    //change wiki city
    wiki.changeWikiCity(city);
    //get wiki info
    getWiki();

    place.changeCity(city);

    getPlaces();
  }
}

//exchange

const rateEl = document.getElementById("rate");
const currencyEle_one = document.getElementById("exchange__currency--1");
const currencyEle_two = document.getElementById("exchange__currency--2");
const amountEle_one = document.getElementById("amount-one");
const amountEle_two = document.getElementById("amount-two");
const swap = document.getElementById("swap");
function getMoney() {
  ex.getCurrency().then(results => {
    const currCodes = Object.keys(results.rates);
    console.log(results);
    let html = "";
    currCodes.forEach(code => {
      html += `
      <option value="${code}" class="list">${code}</option>

      `;
    });
    currencyEle_one.innerHTML = html;
    currencyEle_two.innerHTML = html;
    let curVal = currencyEle_two.value;
    currencyEle_one.value = "USD";
    calculate(results["rates"][`${currencyEle_two.value}`]);
  });
}

function calculate(rate) {
  let value = amountEle_one.value;
  const currency_one = currencyEle_one.value;
  const currency_two = currencyEle_two.value;
  amountEle_two.value = (value * rate).toFixed(2);
}

ui.topBar();

amountEle_one.addEventListener("input", e => {
  ex.getCurrency().then(results => {
    calculate(results["rates"][`${currencyEle_two.value}`]);
  });
});

swap.addEventListener("click", e => {
  const temp = currencyEle_one.value;
  currencyEle_one.value = currencyEle_two.value;
  currencyEle_two.value = temp;
  ex.changeCurrency(currencyEle_one.value);
  ex.getCurrency().then(results => {
    calculate(results["rates"][`${currencyEle_two.value}`]);
  });
});
