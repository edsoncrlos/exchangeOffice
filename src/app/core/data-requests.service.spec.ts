import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { forkJoin, map, Observable } from 'rxjs';


import { ExchangeRateServiceStumb, mockCoins, mockLatestCoins } from '../core/exchange-rate-api.service.doubles';
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
    const stumbValue = ExchangeRateServiceStumb?.getCoins?.()!;
    const returnStumb = new Observable<Coin[]>((coins) => {
      coins.next(mockCoins)
      coins.complete()
    })

    exchangeRateSpy.getCoins.and.returnValue(stumbValue);
    const returnService = service.getCoins();
    expect(service.CoinSymbols).toBeUndefined();

    forkJoin({
      returnService,
      returnStumb
    }).pipe(
      map((Returns: {returnService: Coin[], returnStumb: Coin[]}) => Returns)
    ).subscribe(Returns => {
      expect(Returns.returnService.length).toBe(Returns.returnStumb.length);

      expect(Returns.returnService)
        .withContext('service returned stub value')
        .toEqual(Returns.returnStumb)
    });

    expect(service.CoinSymbols).toBeDefined();


    expect(exchangeRateSpy.getCoins.calls.count())
      .withContext('Spy method was called once')
      .toBe(1);

    expect(exchangeRateSpy.getCoins.calls.mostRecent().returnValue)
      .toBe(stumbValue);
  })

  it('should only return coins that exist getLatest', () => {
    const stumbValue = ExchangeRateServiceStumb?.getLatest?.()!;
    const stumbValueSymbols = ExchangeRateServiceStumb?.getCoins?.()!;

    const returnLatestStumb = new Observable<Coin[]>((coins) => {
      coins.next(mockLatestCoins)
      coins.complete()
    })

    exchangeRateSpy.getCoins.and.returnValue(stumbValueSymbols);
    exchangeRateSpy.getLatest.and.returnValue(stumbValue);
    const returnLatest = service.getValidCoinsForConversion();

    forkJoin({
      returnLatest,
      returnLatestStumb
    }).pipe(
      map((Returns: {returnLatest: Coin[], returnLatestStumb: Coin[]}) => Returns)
    ).subscribe(Returns => {
      expect(Returns.returnLatest.length).toBe(Returns.returnLatestStumb.length);

      expect(Returns.returnLatest)
        .withContext('service returned stub value')
        .toEqual(Returns.returnLatestStumb)
    });

    expect(exchangeRateSpy.getLatest.calls.count())
      .withContext('Spy method was called once')
      .toBe(1);

    expect(exchangeRateSpy.getLatest.calls.mostRecent().returnValue)
      .toBe(stumbValue);

      expect(exchangeRateSpy.getCoins.calls.count())
      .withContext('Spy method was called once')
      .toBe(1);

    expect(exchangeRateSpy.getCoins.calls.mostRecent().returnValue)
      .toBe(stumbValueSymbols);
  })
});
