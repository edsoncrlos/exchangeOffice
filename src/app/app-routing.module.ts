import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CoinConverterComponent } from './coin-converter/coin-converter.component';
import { CoinListingComponent } from './coin-listing/coin-listing.component';
import { ConversionHistoryComponent } from './conversion-history/conversion-history.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'coin-listing', component: CoinListingComponent},
  { path: 'coin-converter', component: CoinConverterComponent},
  { path: 'conversion-history', component: ConversionHistoryComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
