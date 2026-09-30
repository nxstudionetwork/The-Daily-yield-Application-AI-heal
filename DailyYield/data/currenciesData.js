'use strict';

(function() {
  var currencies = [
    { pair: 'USD/INR', name: 'US Dollar / Indian Rupee', rate: 82.45, change: -0.32, changePct: -0.39, flag: '🇺🇸🇮🇳' },
    { pair: 'EUR/USD', name: 'Euro / US Dollar', rate: 1.0876, change: 0.0045, changePct: 0.41, flag: '🇪🇺🇺🇸' },
    { pair: 'GBP/USD', name: 'British Pound / US Dollar', rate: 1.2734, change: -0.0023, changePct: -0.18, flag: '🇬🇧🇺🇸' },
    { pair: 'USD/JPY', name: 'US Dollar / Japanese Yen', rate: 158.90, change: 2.34, changePct: 1.49, flag: '🇺🇸🇯🇵' },
    { pair: 'USD/CNY', name: 'US Dollar / Chinese Yuan', rate: 7.2340, change: 0.0560, changePct: 0.78, flag: '🇺🇸🇨🇳' },
    { pair: 'AUD/USD', name: 'Australian Dollar / US Dollar', rate: 0.6734, change: 0.0034, changePct: 0.51, flag: '🇦🇺🇺🇸' },
    { pair: 'USD/CHF', name: 'US Dollar / Swiss Franc', rate: 0.8678, change: -0.0045, changePct: -0.52, flag: '🇺🇸🇨🇭' },
    { pair: 'EUR/GBP', name: 'Euro / British Pound', rate: 0.8541, change: 0.0012, changePct: 0.14, flag: '🇪🇺🇬🇧' },
    { pair: 'USD/CAD', name: 'US Dollar / Canadian Dollar', rate: 1.3678, change: -0.0089, changePct: -0.65, flag: '🇺🇸🇨🇦' },
    { pair: 'NZD/USD', name: 'New Zealand Dollar / US Dollar', rate: 0.6123, change: 0.0023, changePct: 0.38, flag: '🇳🇿🇺🇸' },
    { pair: 'EUR/JPY', name: 'Euro / Japanese Yen', rate: 172.78, change: 3.45, changePct: 2.04, flag: '🇪🇺🇯🇵' },
    { pair: 'GBP/JPY', name: 'British Pound / Japanese Yen', rate: 202.34, change: 1.89, changePct: 0.94, flag: '🇬🇧🇯🇵' },
    { pair: 'USD/SGD', name: 'US Dollar / Singapore Dollar', rate: 1.3456, change: -0.0023, changePct: -0.17, flag: '🇺🇸🇸🇬' },
    { pair: 'USD/HKD', name: 'US Dollar / Hong Kong Dollar', rate: 7.8123, change: 0.0012, changePct: 0.02, flag: '🇺🇸🇭🇰' },
    { pair: 'USD/ZAR', name: 'US Dollar / South African Rand', rate: 18.45, change: 0.34, changePct: 1.88, flag: '🇺🇸🇿🇦' },
    { pair: 'USD/TRY', name: 'US Dollar / Turkish Lira', rate: 33.45, change: 0.56, changePct: 1.70, flag: '🇺🇸🇹🇷' },
    { pair: 'USD/BRL', name: 'US Dollar / Brazilian Real', rate: 5.67, change: -0.12, changePct: -2.07, flag: '🇺🇸🇧🇷' },
    { pair: 'EUR/CHF', name: 'Euro / Swiss Franc', rate: 0.9434, change: -0.0034, changePct: -0.36, flag: '🇪🇺🇨🇭' },
    { pair: 'AUD/NZD', name: 'Australian Dollar / NZ Dollar', rate: 1.1000, change: 0.0012, changePct: 0.11, flag: '🇦🇺🇳🇿' },
    { pair: 'USD/MXN', name: 'US Dollar / Mexican Peso', rate: 17.23, change: -0.23, changePct: -1.32, flag: '🇺🇸🇲🇽' },
    { pair: 'INR/EUR', name: 'Indian Rupee / Euro', rate: 0.0111, change: -0.0001, changePct: -0.80, flag: '🇮🇳🇪🇺' },
    { pair: 'INR/GBP', name: 'Indian Rupee / British Pound', rate: 0.0092, change: 0.0001, changePct: 0.21, flag: '🇮🇳🇬🇧' },
    { pair: 'USD/KRW', name: 'US Dollar / South Korean Won', rate: 1378.90, change: 12.34, changePct: 0.90, flag: '🇺🇸🇰🇷' },
    { pair: 'USD/SEK', name: 'US Dollar / Swedish Krona', rate: 10.45, change: -0.12, changePct: -1.14, flag: '🇺🇸🇸🇪' },
    { pair: 'USD/NOK', name: 'US Dollar / Norwegian Krone', rate: 10.67, change: -0.08, changePct: -0.74, flag: '🇺🇸🇳🇴' },
    { pair: 'EUR/AUD', name: 'Euro / Australian Dollar', rate: 1.6156, change: 0.0034, changePct: 0.21, flag: '🇪🇺🇦🇺' },
    { pair: 'GBP/AUD', name: 'British Pound / Australian Dollar', rate: 1.8912, change: -0.0045, changePct: -0.24, flag: '🇬🇧🇦🇺' },
    { pair: 'USD/THB', name: 'US Dollar / Thai Baht', rate: 34.56, change: 0.23, changePct: 0.67, flag: '🇺🇸🇹🇭' },
    { pair: 'USD/IDR', name: 'US Dollar / Indonesian Rupiah', rate: 15890.00, change: 123.45, changePct: 0.78, flag: '🇺🇸🇮🇩' },
    { pair: 'USD/PHP', name: 'US Dollar / Philippine Peso', rate: 56.78, change: 0.45, changePct: 0.80, flag: '🇺🇸🇵🇭' }
  ];

  window.CurrenciesData = {
    currencies: currencies,
    getByPair: function(pair) { return currencies.find(function(c) { return c.pair === pair; }); },
    getGainers: function(n) {
      n = n || 5;
      return currencies.slice().sort(function(a, b) { return b.changePct - a.changePct; }).slice(0, n);
    },
    getLosers: function(n) {
      n = n || 5;
      return currencies.slice().sort(function(a, b) { return a.changePct - b.changePct; }).slice(0, n);
    },
    getMostVolatile: function(n) {
      n = n || 5;
      return currencies.slice().sort(function(a, b) { return Math.abs(b.changePct) - Math.abs(a.changePct); }).slice(0, n);
    },
    search: function(q) {
      var query = q.toLowerCase();
      return currencies.filter(function(c) {
        return c.pair.toLowerCase().indexOf(query) !== -1 || c.name.toLowerCase().indexOf(query) !== -1;
      });
    }
  };
})();
