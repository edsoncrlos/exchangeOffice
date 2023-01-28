import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort} from '@angular/material/sort';

import { ExchangeRateService } from '../core/exchange-rate.service';
import { Coin } from '../core/exchange-rate-api.interfaces';

@Component({
  selector: 'app-coin-listing',
  templateUrl: './coin-listing.component.html',
  styleUrls: ['./coin-listing.component.css']
})
export class CoinListingComponent implements OnInit, OnDestroy, AfterViewInit {
  coins: Coin[] = [];
  response!: Subscription;

  displayColumns: string[] = ['code','description'];
  dataSource!: MatTableDataSource<Coin>;
  filter: string = '';
  pageSize = 5;

  constructor (
    private exchangeRate: ExchangeRateService
  ) { }


  ngOnInit(): void {
  this.response = this.exchangeRate.getCoins()
    .subscribe((response) => {
      if (response.success === true) {
        this.coins = Object.values(response.symbols)
        this.dataSource = new MatTableDataSource<Coin>(this.coins);
      }
    })
  }

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, 150)
  }

  ngOnDestroy() {
    this.response.unsubscribe();
  }

  handlePageEvent() {
    if (this.pageSize && this.pageSize >  0 && this.pageSize < this.coins.length) {
      this.paginator._changePageSize(this.pageSize);
    }
  }

  applyfilter() {
    this.dataSource.filter = this.filter;
  }
}
