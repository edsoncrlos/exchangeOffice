import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { ExchangeRateService } from '../core/exchange-rate.service';
import { Coin } from '../core/exchange-rate-api.interfaces';

@Component({
  selector: 'app-coin-listing',
  templateUrl: './coin-listing.component.html',
  styleUrls: ['./coin-listing.component.css']
})
export class CoinListingComponent implements OnInit, OnDestroy {
  response!: Subscription;
  coins: Coin[] = [];

  constructor (
    private exchangeRate: ExchangeRateService
  ) { }

  ngOnInit(): void {
    this.response = this.exchangeRate.getCoins().subscribe((response) => {
      if (response.success === true) {
        this.coins = Object.values(response.symbols)
      }
    })
  }

  ngOnDestroy() {
    this.response.unsubscribe();
  }
}
