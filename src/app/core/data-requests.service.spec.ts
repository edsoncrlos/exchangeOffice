import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { forkJoin, map, Observable } from 'rxjs';


import { ExchangeRateServiceStub, mockCoins, mockLatestCoins } from '../core/exchange-rate-api.service.doubles';
import { DataRequestsService } from './data-requests.service';
import { Coin } from './exchange-rate-api.interfaces';
import { ExchangeRateApiService } from './exchange-rate-api.service';

describe('DataRequestsService', () => {
  let service: DataRequestsService;
  let exchangeRateSpy: jasmine.SpyObj<ExchangeRateApiService>;

  beforeEach(() => {
    const mockExchangeRate = jasmine.createSpyObj<ExchangeRateApiService>('ExchangeRate', [ 'getCoins', 'getLatest']);

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        DataRequestsService,
        { provide: ExchangeRateApiService, useValue: mockExchangeRate }
      ]
    });

    service = TestBed.inject(DataRequestsService);
    exchangeRateSpy = TestBed.inject(ExchangeRateApiService) as jasmine.SpyObj<ExchangeRateApiService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return ResponseSymbols from exchangeRate as Observable of coins', () => {
    const stubValue = ExchangeRateServiceStub?.getCoins?.()!;
    const returnStub = new Observable<Coin[]>((coins) => {
      coins.next(mockCoins);
      coins.complete();
    });

    exchangeRateSpy.getCoins.and.returnValue(stubValue);
    const returnService = service.getCoins();
    expect(service.CoinSymbols).toBeUndefined();

    forkJoin({
      returnService,
      returnStub
    }).pipe(
      map((Returns: {returnService: Coin[], returnStub: Coin[]}) => Returns)
    ).subscribe(Returns => {
      expect(Returns.returnService.length).toBe(Returns.returnStub.length);

      expect(Returns.returnService)
        .withContext('service returned stub value')
        .toEqual(Returns.returnStub);
    });

    expect(service.CoinSymbols).toBeDefined();


    expect(exchangeRateSpy.getCoins.calls.count())
      .withContext('Spy method was called once')
      .toBe(1);

    expect(exchangeRateSpy.getCoins.calls.mostRecent().returnValue)
      .toBe(stubValue);
  });

  it('should only return coins that exist getLatest', () => {
    const stubValue = ExchangeRateServiceStub?.getLatest?.()!;
    const stubValueSymbols = ExchangeRateServiceStub?.getCoins?.()!;

    const returnLatestStub = new Observable<Coin[]>((coins) => {
      coins.next(mockLatestCoins);
      coins.complete();
    });

    exchangeRateSpy.getCoins.and.returnValue(stubValueSymbols);
    exchangeRateSpy.getLatest.and.returnValue(stubValue);
    const returnLatest = service.getValidCoinsForConversion();

    forkJoin({
      returnLatest,
      returnLatestStub
    }).pipe(
      map((Returns: {returnLatest: Coin[], returnLatestStub: Coin[]}) => Returns)
    ).subscribe(Returns => {
      expect(Returns.returnLatest.length).toBe(Returns.returnLatestStub.length);

      expect(Returns.returnLatest)
        .withContext('service returned stub value')
        .toEqual(Returns.returnLatestStub);
    });

    expect(exchangeRateSpy.getLatest.calls.count())
      .withContext('Spy method was called once')
      .toBe(1);

    expect(exchangeRateSpy.getLatest.calls.mostRecent().returnValue)
      .toBe(stubValue);

    expect(exchangeRateSpy.getCoins.calls.count())
      .withContext('Spy method was called once')
      .toBe(1);

    expect(exchangeRateSpy.getCoins.calls.mostRecent().returnValue)
      .toBe(stubValueSymbols);
  });
});
