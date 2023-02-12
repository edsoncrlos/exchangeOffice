import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExchangeRateApiService } from './exchange-rate-api.service';
import { SessionStorageService } from './session-storage.service';
import { DataRequestsService } from './data-requests.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    ExchangeRateApiService,
    SessionStorageService,
    DataRequestsService
  ]
})
export class CoreModule { }
