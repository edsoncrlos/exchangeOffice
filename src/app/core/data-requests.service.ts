import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, take } from 'rxjs';
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
            this.CoinSymbols = coins;
            observer.next(this.CoinSymbols);
            observer.complete();
          });
      }
    });
  }

  getValidCoinsForConversion() {
    return new Observable<Coin[]>((coins) => {
      forkJoin({
        coins$: this.getCoins(),
        latest$: this.exchangeRate.getLatest()
      }).subscribe(result => {
        const latestCodes = Object.keys(result.latest$.rates);

        coins.next(result.coins$.filter(c => latestCodes.includes(c.code)));
        coins.complete();
      });
    });
  }
}
