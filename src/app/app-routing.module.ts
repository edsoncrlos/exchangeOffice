import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CoinListingComponent } from './coin-listing/coin-listing.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'coin-listing', component: CoinListingComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
