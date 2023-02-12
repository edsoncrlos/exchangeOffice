import { Injectable } from '@angular/core';
import { map, Observable, take } from 'rxjs';
import { Coin } from './exchange-rate-api.interfaces';
import { ExchangeRateApiService } from './exchange-rate-api.service';

@Injectable({
  providedIn: 'root'
})
export class DataRequestsService {
  CoinSymbols!: Coin[];

  constructor(
    private exchangeRate: ExchangeRateApiService
  ) { }

  getCoins() {
    return new Observable<Coin[]>((coins) => {
      if (this.CoinSymbols != undefined) {

        coins.next(this.CoinSymbols);
        coins.complete();
      } else {
        const observer = coins;

        this.exchangeRate.getCoins()
        .pipe(
          take(1),
          map(response => Object.values(response.symbols as Coin[]))
        ).subscribe((coins) => {
          this.CoinSymbols = coins
          observer.next(this.CoinSymbols);
          observer.complete();
        })
      }
    })
  }

  getValidCoinsForConversion() {

    return new Observable<Coin[]>((coins) => {
      const observer = coins;
      this.getCoins().pipe(
        take(1)
      ).subscribe((coins) => {

        const symbols = observer
        this.exchangeRate.getLatest().pipe(
          take(1),
          map(response => Object.keys(response.rates as string[]))
        ).subscribe((codeCoins) => {
          symbols.next(coins.filter(c => codeCoins.includes(c.code)))
        })

      })
    })
  }
}
