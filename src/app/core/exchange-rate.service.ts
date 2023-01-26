import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ResponseSymbols } from './exchange-rate-api.interfaces';

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
}
