import { Observable } from "rxjs";

import { ResponseSymbols } from "./exchange-rate-api.interfaces";
import { ExchangeRateApiService } from "./exchange-rate-api.service";

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
  }
}
