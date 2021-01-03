class Exchange {
  constructor(currency) {
    this.currency = currency;
    this.default = "USD";
  }

  changeCurrency(currency) {
    this.currency = currency;
  }

  async getCurrency() {
    const response = await fetch(
      `https://api.exchangeratesapi.io/latest?base=${this.currency}`
    );

    const responseData = await response.json();

    return responseData;
  }
}
