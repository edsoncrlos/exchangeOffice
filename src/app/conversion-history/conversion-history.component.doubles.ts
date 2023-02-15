import { SessionStorageService } from '../core/session-storage.service';
import { Historic } from './conversion-history.interfaces';

export const mockDisplayColumns = ['Data', 'Hora', 'Quantidade', 'Moeda de origem', 'Moeda de destino', 'Resultado', 'Taxa'];

export const mockHistoric: Historic[] = [
  {
    date: '02/15/2023',
    hourAndMinutes: '12:03',
    amount: 599,
    originCoin: 'EUR',
    destinationCoin: 'BRL',
    result: 3331.553632,
    rate: 3331.553632,
    hasShowIcon: false
  },
  {
    date: '02/15/2023',
    hourAndMinutes: '09:06',
    amount: 60000,
    originCoin: 'BRL',
    destinationCoin: 'USD',
    result: 11561.753588,
    rate: 0.192696,
    hasShowIcon: true
  },
  {
    date: '02/14/2023',
    hourAndMinutes: '13:03',
    amount: 10000,
    originCoin: 'USD',
    destinationCoin: 'EUR',
    result: 9330.556661,
    rate: 0.933056,
    hasShowIcon: false
  },
  {
    date: '02/15/2023',
    hourAndMinutes: '13:05',
    amount: 9331.489717,
    originCoin: 'EUR',
    destinationCoin: 'USD',
    result: 10001,
    rate: 1.071747,
    hasShowIcon: true
  }
];

export const SessionStorageServiceStub: Partial<SessionStorageService<Historic>> = {
  getItem(key: string) {
    return [{
      date: '02/15/2023',
      hourAndMinutes: '12:03',
      amount: 599,
      originCoin: 'EUR',
      destinationCoin: 'BRL',
      result: 3331.553632,
      rate: 3331.553632,
      hasShowIcon: false
    },
    {
      date: '02/15/2023',
      hourAndMinutes: '09:06',
      amount: 60000,
      originCoin: 'BRL',
      destinationCoin: 'USD',
      result: 11561.753588,
      rate: 0.192696,
      hasShowIcon: true
    },
    {
      date: '02/14/2023',
      hourAndMinutes: '13:03',
      amount: 10000,
      originCoin: 'USD',
      destinationCoin: 'EUR',
      result: 9330.556661,
      rate: 0.933056,
      hasShowIcon: false
    },
    {
      date: '02/15/2023',
      hourAndMinutes: '13:05',
      amount: 9331.489717,
      originCoin: 'EUR',
      destinationCoin: 'USD',
      result: 10001,
      rate: 1.071747,
      hasShowIcon: true
    }];
  },

  setItem(key: string, array: Historic[]) {
    return;
  }
};
