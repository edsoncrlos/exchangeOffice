import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { ResponseConvert, ResponseLatest, ResponseSymbols } from './exchange-rate-api.interfaces';

@Injectable({
  providedIn: 'root'
})
export class ExchangeRateApiService {

  private readonly API = environment.API_URL;

  constructor(
    private http: HttpClient
  ) { }

  getCoins() {
    return this.http.get<ResponseSymbols>(`${this.API}symbols`);
  }

  getConversionCoins(originCoin: string, destinationCoin: string, amount: number) {
    return this.http.get<ResponseConvert>(`${this.API}convert?from=${originCoin}&to=${destinationCoin}&amount=${amount}`);
  }

  getLatest() {
    return this.http.get<ResponseLatest>(`${this.API}latest`)
  }
}
