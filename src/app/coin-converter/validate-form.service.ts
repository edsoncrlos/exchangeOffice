import { Injectable } from '@angular/core';
import { CodeAndDescription, CoinsConvertForm } from './coin-converter.interfaces';

@Injectable({
  providedIn: 'root'
})
export class ValidateFormService {
  codeAndDescriptionCoin!: CodeAndDescription[];

  constructor() { }

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
    console.log(originCoin)
    if (this.isCodeValid(originCoin) && this.isCodeValid(destinationCoin)) {
      if (originCoin !== destinationCoin) {
        return true;
      }
    }
    return false;
  }

  validate({originCoin, destinationCoin, amount}: CoinsConvertForm) {
    const originCode = this.getCodeCoin(originCoin);
    const destinationCode = this.getCodeCoin(destinationCoin);

    const isValidCodes = this.validateCodes(originCode, destinationCode);
    const isNumberPositive = amount > 0;

    return isValidCodes && isNumberPositive;
  }
}
