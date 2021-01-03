class Google {
  constructor(city) {
    this.city = city;
    this.apiKey = "AIzaSyBTUWf_ax7VvOFysJGaEZvFcz1mPG2ow08";
  }

  changeCity(city) {
    this.city = city;
  }

  async getPlaces() {
    const response = await fetch(
      `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/textsearch/json?query=${this.city}+city+point+of+interest&language=en&key=${this.apiKey}`
    );

    const responseData = await response.json();

    return responseData;
  }
}
