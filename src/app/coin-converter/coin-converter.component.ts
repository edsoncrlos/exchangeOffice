import { Component, OnInit } from '@angular/core';
import { first, Observable } from 'rxjs';

import { Historic } from '../conversion-history/conversion-history.interfaces';
import { DataRequestsService } from '../core/data-requests.service';
import { ResponseConvert } from '../core/exchange-rate-api.interfaces';

import { ExchangeRateApiService } from '../core/exchange-rate-api.service';
import { SessionStorageService } from '../core/session-storage.service';
import { CodeAndDescription, CoinsConvertForm } from './coin-converter.interfaces';

@Component({
  selector: 'app-coin-converter',
  templateUrl: './coin-converter.component.html',
  styleUrls: ['./coin-converter.component.css']
})
export class CoinConverterComponent implements OnInit {
  conversion$!: Observable<ResponseConvert>;

  codeAndDescriptionCoin: CodeAndDescription[] = [];

  coinsConverterForm: CoinsConvertForm = {
    originCoin: '',
    destinationCoin: '',
    amount: 1
  };
  originCode = '';
  destinationCode = '';
  amount = 0;
  showResult = false;
  isCodesIncorrect = false;
  isLoading = false;

  constructor (
    private exchangeRate: ExchangeRateApiService,
    private sessionStorage: SessionStorageService<Historic>,
    private dataRequest: DataRequestsService
  ) { }

  ngOnInit(): void {
    this.dataRequest.getValidCoinsForConversion().pipe(first())
      .subscribe((coins) => {
        this.codeAndDescriptionCoin = coins.map((c) => {
          return {
            code: c.code,
            description: `${c.description} - ${c.code}`
          };
        });
      });
  }

  applyFilter(filter: string) {
    filter = filter.trim().toUpperCase();
    if (filter === '' && this.codeAndDescriptionCoin.length === 0) {
      return this.codeAndDescriptionCoin;
    }

    return this.codeAndDescriptionCoin.filter(coin => coin.description.toUpperCase().indexOf(filter) != -1);
  }

  getCodeCoin(coin: string) {
    const length = coin.length;
    return coin.trim().substring(length-3, length).toUpperCase();
  }

  isCodeValid(code: string) {
    if (this.codeAndDescriptionCoin.find(c => c.code === code) != undefined) {
      return true;
    }
    return false;
  }

  validateCodes(originCoin: string, destinationCoin: string) {

    if (this.isCodeValid(originCoin) && this.isCodeValid(destinationCoin)) {
      if (originCoin !== destinationCoin) {
        return true;
      }
    }
    return false;
  }

  validate() {
    const originCode = this.getCodeCoin(this.coinsConverterForm.originCoin);
    const destinationCode = this.getCodeCoin(this.coinsConverterForm.destinationCoin);
    const amount = this.coinsConverterForm.amount;

    const isValidCodes = this.validateCodes(originCode, destinationCode);
    const isNumberPositive = amount > 0;

    return isValidCodes && isNumberPositive;
  }

  messageErrorAmount(): string {
    if (this.coinsConverterForm.amount != null) {
      if (this.coinsConverterForm.amount <= 0) {
        return 'O valor deve ser maior que zero';
      }
    }
    return 'O valor não pode ser vazio e deve conter somente números, por favor.';
  }

  onSubmit() {
    if (this.validate()) {
      this.originCode = this.getCodeCoin(this.coinsConverterForm.originCoin);
      this.destinationCode = this.getCodeCoin(this.coinsConverterForm.destinationCoin);
      this.amount = this.coinsConverterForm.amount;
      this.isCodesIncorrect = false;

      this.isLoading = true;

      this.convertCoins();
    } else {
      this.isCodesIncorrect = true;
    }
  }

  convertCoins() {
    this.conversion$ = this.exchangeRate.getConversionCoins(this.originCode, this.destinationCode, this.amount);
    this.showResult = true;
    this.addConversion();
  }

  addConversion() {
    this.conversion$.pipe(
      first()
    ).subscribe((conversion) => {
      this.isLoading = false;

      const tenThousand = 10000;
      const codeDollar = 'USD';
      let isGreaterThanTenThousandDollars = false;

      const conversionToDollar = conversion.query.to === codeDollar;
      const conversionFromDollar = conversion.query.from === codeDollar;
      if (conversionToDollar || conversionFromDollar) {
        if ((conversionToDollar && conversion.result > tenThousand) || (conversionFromDollar && conversion.query.amount > tenThousand)) {
          isGreaterThanTenThousandDollars = true;
        }
        this.addHistoricInSessionStorage(conversion, isGreaterThanTenThousandDollars);
      } else {
        this.exchangeRate.getConversionCoins(conversion.query.to, codeDollar, conversion.result)
          .pipe(
            first()
          )
          .subscribe((response) => {
            if (response.result > tenThousand) {
              isGreaterThanTenThousandDollars = true;
            }
            this.addHistoricInSessionStorage(conversion, isGreaterThanTenThousandDollars);
          });
      }
    });
  }

  addHistoricInSessionStorage(conversion: ResponseConvert, isGreaterThanTenThousandDollars: boolean) {
    const hourAndMinutes =  Date().match(/\d\d:\d\d/)?.[0] as string;

    const historic: Historic = {
      date: conversion.date,
      hourAndMinutes: hourAndMinutes,
      amount: conversion.query.amount,
      originCoin: conversion.query.from,
      destinationCoin: conversion.query.to,
      result: conversion.result,
      rate: conversion.info.rate,
      hasShowIcon: isGreaterThanTenThousandDollars
    };

    this.sessionStorage.addItem('historic', historic);
  }
}
