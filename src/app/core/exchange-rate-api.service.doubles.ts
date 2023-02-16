import { Observable } from 'rxjs';

import { Coin, ResponseConvert, ResponseLatest, ResponseSymbols } from './exchange-rate-api.interfaces';
import { ExchangeRateApiService } from './exchange-rate-api.service';


export const mockCoins: Coin[] = [
  {
    code: 'USD',
    description: 'United States Dollar'
  },
  {
    code: 'BRL',
    description: 'Brazilian Real'
  }
];

export const mockLatestCoins = [mockCoins[0]];

export const mockResponsesConvert: ResponseConvert[] = [
  {
    success: true,
    query: { from: 'USD', to: 'BRL', amount: 10000 },
    info: { rate: 5.189524 },
    historical: false,
    date: '2023-02-15',
    result: 51895.241965
  },
  {
    success: true,
    query: { from: 'USD', to: 'BRL', amount: 10001 },
    info: { rate: 5.189524 },
    historical: false,
    date: '2023-02-15',
    result: 51900.431489
  },
  {
    success: true,
    query: { from: 'BRL', to: 'USD', amount: 6000 },
    info: { rate: 0.192696 },
    historical: false,
    date: '2023-02-15',
    result: 1156.175359
  },
  {
    success: true,
    query: { from: 'BRL', to: 'USD', amount: 60000 },
    info: { rate: 0.192696 },
    historical: false,
    date: '2023-02-15',
    result: 11561.753588
  },
  {
    success: true,
    query: { from: 'BRL', to: 'EUR', amount: 52222.06 },
    info: { rate: 0.179796 },
    historical: false,
    date: '2023-02-15',
    result: 9389.317235
  },
  {
    success: true,
    query: { from: 'EUR', to: 'USD', amount: 9389.317235 },
    info: { rate: 1.071747 },
    historical: false,
    date: '2023-02-15',
    result: 10062.976494
  },
  {
    success: true,
    query: { from: 'BRL', to: 'EUR', amount: 51890.06 },
    info: { rate: 0.179796 },
    historical: false,
    date: '2023-02-15',
    result: 9329.624965
  },
  {
    success: true,
    query: { from: 'EUR', to: 'USD', amount: 9329.624965 },
    info: { rate: 1.071747 },
    historical: false,
    date: '2023-02-15',
    result: 9999.001457
  }
];

export const responseSymbols: ResponseSymbols = {
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
};

export const responseConvert: ResponseConvert = {
  success: true,
  query: { from: 'USD', to: 'BRL', amount: 300 },
  info: { rate: 5.149935 },
  historical: false,
  date: '2023-02-06',
  result: 1544.980492
};

export const responseLatest: ResponseLatest = {
  success: true,
  rates: {
    'BRL': 5570749,
    'EUR': 1,
    'USD': 1.068834
  }
};

export const ExchangeRateServiceStub: Partial<ExchangeRateApiService> = {
  getCoins() {
    return new Observable((observer) => {
      observer.next(responseSymbols);
      observer.complete();
    });
  },

  getLatest() {
    const response: ResponseLatest = {
      success: true,
      rates: {
        'USD': 1.06695,
      }
    };

    return new Observable((observer) => {
      observer.next(response);
      observer.complete();
    });
  },

  getConversionCoins(originCoin: string, destinationCoin: string, amount: number) {

    const response = mockResponsesConvert.find((r) => {
      if (r.query.from == originCoin && r.query.to == destinationCoin && r.query.amount === amount) {
        return r;
      }
      return undefined;
    });
    return new Observable((observer) => {
      if (response != undefined) {
        observer.next(response);
      } else {
        observer.error(new Error('mock value not found'));
      }
      observer.complete();
    });
  }
};
