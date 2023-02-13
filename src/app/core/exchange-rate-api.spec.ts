
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ExchangeRateApiService } from './exchange-rate-api.service';
import { Coin, ResponseConvert, ResponseLatest, ResponseSymbols } from './exchange-rate-api.interfaces';
import { environment } from 'src/environments/environment';
import { responseConvert, responseLatest, responseSymbols } from './exchange-rate-api.service.doubles';

describe('ExchangeRateApi', () => {
  let exchangeRate: ExchangeRateApiService;
  let httpTestingController: HttpTestingController;
  const API = environment.API_URL;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [ ExchangeRateApiService ]
    });
    exchangeRate = TestBed.inject(ExchangeRateApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  })

  afterEach(() => {
    httpTestingController.verify();
  })

  it('should be created', () => {
    expect(exchangeRate).toBeTruthy();
  })

  it('Should return Observable with coins', () => {
    const response: ResponseSymbols = responseSymbols;

    const coins: Coin[] = Object.values(response.symbols);

    exchangeRate.getCoins().subscribe(r => {
      const responseCoins = Object.values(r.symbols);

      expect(r).toEqual(response);
      expect(responseCoins.length).toEqual(coins.length);
      expect(responseCoins).toEqual(coins);
    })

    const req = httpTestingController.expectOne(`${API}symbols`);

    expect(req.request.method).toEqual('GET');

    req.flush(response);
  });

  it('Should convert coins', () => {
    const response: ResponseConvert = responseConvert;

    const ConversionURL = `${API}convert?from=USD&to=BRL&amount=300`;

    exchangeRate.getConversionCoins('USD', 'BRL', 300)
    .subscribe((r) => {
      expect(r).toEqual(response)

      expect(r.query.from).toEqual(response.query.from)
      expect(r.query.to).toEqual(response.query.to)
      expect(r.query.amount).toEqual(response.query.amount)
      expect(r.info.rate).toEqual(response.info.rate)
      expect(r.historical).toEqual(response.historical)
      expect(r.date).toEqual(response.date)
      expect(r.result).toEqual(response.result)
    })

    const req = httpTestingController.expectOne(ConversionURL)

    expect(req.request.method).toEqual('GET')

    req.flush(response)
  })

  it('should return latest quotes', () => {
    const response: ResponseLatest = responseLatest;

    exchangeRate.getLatest().subscribe((r) => {
      expect(r).toEqual(response)
      expect(r.rates).toEqual(response.rates)
    })

    const req = httpTestingController.expectOne(`${API}latest`)

    expect(req.request.method).toEqual('GET')

    req.flush(response)
  })
})
