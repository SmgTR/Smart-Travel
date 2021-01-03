class Weather{
  constructor(city,country,lat,long){
      this.apiKey = '99fc2d7b24e1ffdcefd5e46f87bf7c26';
      this.city = city;
      this.country = country;
      this.lat = lat;
      this.long = long;
  }
  //current weather
  async getWeather(){
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${this.city},${this.country}&units=metric&appid=${this.apiKey}`)

    const responseData = await response.json();

    return responseData;

  }

  changeWeatherLocation(city, country){
    this.city = city;
    this.country = country;
  }

  setGeo(lat,long){
    this.lat = lat;
    this.long = long;
  }


  //next 4 days weather
  async weekWeather(){
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${this.lat}&lon=${this.long}&units=metric&appid=${this.apiKey}`)


    const responseData = await response.json();

    return responseData;

  }


}
