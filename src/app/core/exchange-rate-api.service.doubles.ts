import { Observable } from "rxjs";

import { Coin, ResponseLatest, ResponseSymbols } from "./exchange-rate-api.interfaces";
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


export const ExchangeRateServiceStumb: Partial<ExchangeRateApiService> = {
  getCoins() {
    const response: ResponseSymbols = {
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

    return new Observable((observer) => {
      observer.next(response);
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
