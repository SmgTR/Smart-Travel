class UI {
  constructor() {
    this.location = document.getElementById("city__name");
    this.error = document.querySelector(".error");

    //wiki constructors
    this.img = document.querySelector(".wiki__photo");
    this.title = document.querySelector(".wiki__title");
    this.description = document.querySelector(".wiki__description");
    this.link = document.querySelector(".wiki__link");

    //events
    this.ticket = document.querySelector(".tickets");

    this.placeID = "ChIJ9Rk2BW1bFkcRmKV_1sTfuaw";
    this.apiKey = "AIzaSyCzxMfo3qtHgxKblrMmq23q8Ha-W1QJd9k";
  }

  paint(weather) {
    // description and icon
    weather.weather.forEach(function(w) {
      document.getElementById("desc").textContent = w.main;

      document.querySelector(
        ".weather__top"
      ).children[0].classList = `wi wi-owm-${w.id}`;
    });

    //temp, temp min,max

    //overall temp
    document.getElementById("temp").innerHTML = `${Math.round(
      weather.main.temp
    )}`;
    //min
    document.getElementById("min-temp").innerHTML = `Min Temp: ${Math.round(
      weather.main.temp_min
    )} <span>&#8451;</span>`;
    //max
    document.getElementById("max-temp").innerHTML = `Max Temp: ${Math.round(
      weather.main.temp_max
    )} <span>&#8451;</span>`;

    //sunrise and Sunset
    let unix = [weather.sys.sunrise, weather.sys.sunset];

    let outputArray = [];
    //calculate time from unix
    unix.forEach(function(t) {
      let date = new Date(t * 1000);
      outputArray.push(date);

      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      };

      document.querySelector(
        ".weather__today"
      ).textContent = date.toLocaleDateString("en-En", options);
    });

    function addZero(val) {
      if (val < 10) {
        return "0" + val;
      } else {
        return val;
      }
    }

    document.getElementById("sunrise").textContent = `Sunrise: ${addZero(
      outputArray[0].getHours()
    )}:${addZero(outputArray[0].getMinutes())}`;

    document.getElementById("sunset").textContent = `Sunset: ${addZero(
      outputArray[1].getHours()
    )}:${addZero(outputArray[1].getMinutes())}`;

    //hide error

    //Location name
    this.location.textContent = weather.name;
  }

  wiki(info) {
    if (info.type === "standard") {
      this.img.src = info.originalimage.source;
      this.description.innerHTML = `${info.extract} <br><a href="${info.content_urls.desktop.page}" target="_blank" class="wiki__link">Read more...</a>`;
      this.title.textContent = info.displaytitle;

      //set display to visible if before wiki couldnt find city.
      this.img.style.display = "block";
    } else {
      this.title.textContent = "Couldn't load data";
      this.img.style.display = "none";
      this.description.textContent = "Too many articles found";
    }
  }

  weekWeatherPaint(weather) {
    let html = "";
    let days = weather.daily;

    days.forEach(function(d) {
      let date = new Date(d.dt * 1000);
      // console.log(date.getDate());
      let weekday = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ];

      if (new Date().getDay() !== date.getDay()) {
        html += `
      <div class="week__list">
        <h2 class="week__list-title">${weekday[date.getDay()]}</h2>
          <div class="week__list__description">
            <i class="wi wi-owm-${d.weather[0].id} week__icon"></i>
            <h4 class="week__list__description__temp">${Math.round(
              d.temp.day
            )}<span>&#8451;</span></h4>
          </div>
      </div>
      `;
      }
    });
    document.querySelector(".weather__middle").innerHTML = html;
  }

  getEvents(event) {
    let events = event._embedded.events;

    let i = 0;

    let b = 3;

    let html = "";

    events.forEach(function(event) {
      if (
        event.dates.status.code === "rescheduled" ||
        event.dates.status.code === "cancelled"
      ) {
      } else if (i <= b) {
        html += `

           <div class="tickets__box">
           <div class="tickets__box-slides">

           <a href="${event.url}"><img src="${event.images[0].url}" class="tickets__box-img"></a>
           </div>
            <div>
             <h2 class="tickets__box-title">${event.name}</h2>
             <p class="tickets__box-date">${event.dates.start.localDate}</p>
             <p class="tickets__box-status">${event.dates.status.code}</p>


             </div>
           </div>

           <div class="tickets__box-line"></div>

         `;
        i++;
      } else if (i === 0) {
        this.ticket.innerHTML = "<h2>Nothing here</h2>";
      }
    });

    this.ticket.innerHTML = html;
  }

  //delete

  google(place) {
    let placePoint = place.results;

    let i = 0;
    let html = "";

    placePoint.forEach(place => {
      i++;

      if (place.photos !== undefined) {
        html += `

      <li class="card card--${i}"><div class="card__title--background"><h2 class="card__title">${place.name}</h2><span class="hide">${place.place_id}</div></span>
      <img class="card__img" src="https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=AIzaSyBTUWf_ax7VvOFysJGaEZvFcz1mPG2ow08">

      </li>

      `;
      }
    });

    document.querySelector(".google__grid").innerHTML = html;
  }

  notFounded() {
    document.querySelector(".not__founded").style.display = "block";
    document.querySelector(".flex__container").style.display = "none";
    document.querySelector(".weather").style.display = "none";
    document.querySelector(".google").style.display = "none";
  }

  itsOk() {
    document.querySelector(".not__founded").style.display = "none";
  }

  newError(text) {
    ui.error.style.display = "block";
    ui.error.textContent = text;
    setTimeout(function() {
      ui.error.style.display = "none";
    }, 3000);
  }

  //exchange

  //top bar after scroll on sreens higher than tab-land
  topBar() {
    const formStyle = document.querySelector(".search").childNodes;

    let observer = new IntersectionObserver(
      function(entries) {
        if (entries[0].isIntersecting === false)
          formStyle[3].classList = "fixed add";
        else if (entries[0].isIntersecting === true)
          formStyle[3].classList = "search__form";
      },
      { threshold: [0] }
    );

    observer.observe(document.querySelector(".last__places"));
  }
}
