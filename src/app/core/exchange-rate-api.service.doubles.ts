import { Observable } from "rxjs";

import { Coin, ResponseConvert, ResponseLatest, ResponseSymbols } from "./exchange-rate-api.interfaces";
import { ExchangeRateApiService } from "./exchange-rate-api.service";


export const mockCoins: Coin[] = [
  {
    code: 'USD',
    description: 'United States Dollar'
  },
  {
    code: 'BRL',
    description: 'Brazilian Real'
  }
]

export const mockLatestCoins = [mockCoins[0]];

export const responseSymbols: ResponseSymbols = {
  success: true,
  symbols: {
    'USD': {
      code: 'USD',
      description: 'United States Dollar'
    },
    'BRL': {
      code: 'BRL',
      description: 'Brazilian Real'
    }
  }
}

export const responseConvert: ResponseConvert = {
  success: true,
  query: { from: 'USD', to: 'BRL', amount: 300 },
  info: { rate: 5.149935 },
  historical: false,
  date: '2023-02-06',
  result: 1544.980492
}

export const responseLatest: ResponseLatest = {
  success: true,
  rates: {
    'BRL': 5570749,
    'EUR': 1,
    'USD': 1.068834
  }
}

export const ExchangeRateServiceStumb: Partial<ExchangeRateApiService> = {
  getCoins() {
    return new Observable((observer) => {
      observer.next(responseSymbols);
      observer.complete();
    })
  },

  getLatest() {
    const response: ResponseLatest = {
      success: true,
      rates: {
        'USD': 1.06695,
      }
    }

    return new Observable((observer) => {
      observer.next(response);
      observer.complete();
    })
  }
}
