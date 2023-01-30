import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ResponseConvert, ResponseSymbols } from './exchange-rate-api.interfaces';

@Injectable({
  providedIn: 'root'
})
export class ExchangeRateService {

  private readonly API = 'https://api.exchangerate.host/';

  constructor(
    private http: HttpClient
  ) { }

  getCoins() {
    return this.http.get<ResponseSymbols>(`${this.API}symbols`);
  }

  getConversionCoins(originCurreny: string, destinationCurreny: string, amount: number) {
    return this.http.get<ResponseConvert>(`${this.API}convert?from=${originCurreny}&to=${destinationCurreny}&amount=${amount}`);
  }
}
