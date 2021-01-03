class WikiInfo {
  constructor(city) {
    this.city = city;
  }

  async getWikiInfo(){
    const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${this.city}`)

    const responseData = await response.json();

    return responseData;
  }

  changeWikiCity(city){
    this.city = city;
  }
}
