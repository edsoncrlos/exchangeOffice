import { Component, OnInit, ViewChild } from '@angular/core';
import { map, take } from 'rxjs';

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
export class CoinListingComponent implements OnInit {
  coins: Coin[] = [];

  displayColumns: string[] = ['code','description'];
  dataSource!: MatTableDataSource<Coin>;
  filter = '';
  pageSize = 5;

  constructor (
    private exchangeRate: ExchangeRateService
  ) { }

  ngOnInit(): void {
    const self = this;
    this.exchangeRate.getCoins()
      .pipe(
        take(1),
        map(response => Object.values(response.symbols))
      ).subscribe({
        next(response) {
          self.coins = response as Coin[];
        },
        complete() {
          self.dataSource = new MatTableDataSource<Coin>(self.coins);
        }
      });
  }

  private paginator!: MatPaginator;
  private sort!: MatSort;
  @ViewChild(MatSort) set matSort(ms: MatSort) {
    if (ms != undefined) {
      this.sort = ms;
      this.dataSource.sort = this.sort;
    }
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    if (mp != undefined) {
      this.paginator = mp;
      this.dataSource.paginator = this.paginator;
    }
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
