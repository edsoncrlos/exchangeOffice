import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExchangeRateApiService } from './exchange-rate-api.service';
import { SessionStorageService } from './session-storage.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    ExchangeRateApiService,
    SessionStorageService
  ]
})
export class CoreModule { }
