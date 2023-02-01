import { Component, OnInit } from '@angular/core';
import { Observable, take } from 'rxjs';
import { Coin, ResponseConvert } from '../core/exchange-rate-api.interfaces';

import { ExchangeRateApiService } from '../core/exchange-rate-api.service';
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

  constructor (
    private exchangeRate: ExchangeRateApiService
  ) { }

  ngOnInit(): void {
    this.exchangeRate.getCoins()
      .pipe(
        take(1)
      )
      .subscribe((response) => {
        if (response.success === true) {
          const coins: Coin[] = Object.values(response.symbols);
          this.codeAndDescriptionCoin = coins.map((c) => {
            return {
              code: c.code,
              description: `${c.description} - ${c.code}`
            };
          });
        }
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
    console.log(this.coinsConverterForm.amount);
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

      this.convertCoins();
    } else {
      this.isCodesIncorrect = true;
    }
  }

  convertCoins() {
    this.conversion$ = this.exchangeRate.getConversionCoins(this.originCode, this.destinationCode, this.amount);
    this.showResult = true;
  }
}