import { Component, OnInit } from '@angular/core';
import { first, Observable } from 'rxjs';

import { Historic } from '../conversion-history/conversion-history.interfaces';
import { DataRequestsService } from '../core/data-requests.service';
import { ResponseConvert } from '../core/exchange-rate-api.interfaces';

import { ExchangeRateApiService } from '../core/exchange-rate-api.service';
import { SessionStorageService } from '../core/session-storage.service';
import { CodeAndDescription, CoinsConvertForm } from './coin-converter.interfaces';
import { ValidateFormService } from './validate-form.service';

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

  showResult = false;
  isCodesIncorrect = false;
  isLoading = false;

  constructor (
    private exchangeRate: ExchangeRateApiService,
    private sessionStorage: SessionStorageService<Historic>,
    private dataRequest: DataRequestsService,
    private validateForm: ValidateFormService
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
        this.validateForm.codeAndDescriptionCoin = this.codeAndDescriptionCoin;
      });
  }

  applyFilter(filter: string) {
    filter = filter.trim().toUpperCase();
    if (filter === '' && this.codeAndDescriptionCoin.length === 0) {
      return this.codeAndDescriptionCoin;
    }

    return this.codeAndDescriptionCoin.filter(coin => coin.description.toUpperCase().indexOf(filter) != -1);
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
    if (this.validateForm.validate(this.coinsConverterForm)) {

      this.isCodesIncorrect = false;
      this.isLoading = true;

      this.convertCoins();
    } else {
      this.isCodesIncorrect = true;
    }
  }

  convertCoins() {
    const originCode = this.validateForm.getCodeCoin(
      this.coinsConverterForm.originCoin
    );
    const destinationCode = this.validateForm.getCodeCoin(
      this.coinsConverterForm.destinationCoin
    );
    const amount = this.coinsConverterForm.amount;

    this.conversion$ = this.exchangeRate.getConversionCoins(
      originCode, destinationCode, amount
    );

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

  getHourAndMinutes() {
    return Date().match(/\d\d:\d\d/)?.[0] as string;
  }

  addHistoricInSessionStorage(conversion: ResponseConvert, isGreaterThanTenThousandDollars: boolean) {
    const hourAndMinutes = this.getHourAndMinutes();

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
