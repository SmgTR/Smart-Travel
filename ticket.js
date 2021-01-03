class TicketMaster {
  constructor(lat,long) {
    this.apiKey= 'lmhMRtCUUunDZiVLKGtCMG40hP8gaJNQ';
    this.lat = lat;
    this.long= long;
  }


  changeLocation(lat,long){
    this.lat = lat;
    this.long = long;
  }

  async getEvents(){
    const response = await fetch(`https://app.ticketmaster.com/discovery/v2/events.json?latlong=${this.lat},${this.long}&startEndTime
    &apikey=${this.apiKey}`)


    const responseData = await response.json();

    return responseData;
  }

}
