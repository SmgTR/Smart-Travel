class Location {
  constructor(lat, long) {
    this.apiKey = "574a56f8348b40a287637b13435a2930";
    this.savedLat = "";
    this.savedLong = "";
  }

  async getLoc() {
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${this.lat}+${this.long}&key=${this.apiKey}`
    );

    const responseData = await response.json();

    return responseData;
  }

  changeUserLocation(lat, long) {
    this.lat = lat;
    this.long = long;
  }

  saveCoords(lat, long) {
    this.savedLat = lat;
    this.savedLong = long;
  }
}
