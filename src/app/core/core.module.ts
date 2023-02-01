import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExchangeRateApiService } from './exchange-rate-api.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    ExchangeRateApiService
  ]
})
export class CoreModule { }
