import { SessionStorageService } from '../core/session-storage.service';
import { Historic } from './conversion-history.interfaces';

export const mockDisplayColumns = ['Data', 'Hora', 'Quantidade', 'Moeda de origem', 'Moeda de destino', 'Resultado', 'Taxa'];

export const mockHistoric: Historic[] = [
  {
    date: '11/06/2022',
    hourAndMinutes: '12:03',
    amount: 100,
    originCoin: 'BRL',
    destinationCoin: 'USD',
    result: 20.067793,
    rate: 0.200678,
    hasShowIcon: true
  },
  {
    date: '12/07/2023',
    hourAndMinutes: '09:06',
    amount: 90,
    originCoin: 'BRL',
    destinationCoin: 'USD',
    result: 20.067793,
    rate: 0.200678,
    hasShowIcon: false
  },
  {
    date: '11/07/2023',
    hourAndMinutes: '13:03',
    amount: 200,
    originCoin: 'AED',
    destinationCoin: 'USD',
    result: 20.067793,
    rate: 0.200678,
    hasShowIcon: true
  }
];

export const SessionStorageServiceStub: Partial<SessionStorageService<Historic>> = {
  getItem(key: string) {
    return [{
      date: '11/06/2022',
      hourAndMinutes: '12:03',
      amount: 100,
      originCoin: 'BRL',
      destinationCoin: 'USD',
      result: 20.067793,
      rate: 0.200678,
      hasShowIcon: true
    },
    {
      date: '12/07/2023',
      hourAndMinutes: '09:06',
      amount: 90,
      originCoin: 'BRL',
      destinationCoin: 'USD',
      result: 20.067793,
      rate: 0.200678,
      hasShowIcon: false
    },
    {
      date: '11/07/2023',
      hourAndMinutes: '13:03',
      amount: 200,
      originCoin: 'AED',
      destinationCoin: 'USD',
      result: 20.067793,
      rate: 0.200678,
      hasShowIcon: true
    }];
  },

  setItem(key: string, array: Historic[]) {
    return;
  }
};
