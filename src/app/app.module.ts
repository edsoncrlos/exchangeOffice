import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

import { AppComponent } from './app.component';
import { CoinConverterComponent } from './coin-converter/coin-converter.component';
import { CoinListingComponent } from './coin-listing/coin-listing.component';
import { ConversionHistoryComponent } from './conversion-history/conversion-history.component';
import { HomeComponent } from './home/home.component';
import { InputAutocompleteComponent } from './coin-converter/input-autocomplete/input-autocomplete.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CoinListingComponent,
    CoinConverterComponent,
    ConversionHistoryComponent,
    InputAutocompleteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    SharedModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
