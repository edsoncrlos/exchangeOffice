import { Observable } from "rxjs"
import { Coin, ResponseSymbols } from "../core/exchange-rate-api.interfaces"
import { ExchangeRateApiService } from "../core/exchange-rate-api.service"

export const mockDisplayColumns = ["Código", "Descrição"]
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
