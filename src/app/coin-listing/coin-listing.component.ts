import { Component, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { DataRequestsService } from '../core/data-requests.service';
import { Coin } from '../core/exchange-rate-api.interfaces';

@Component({
  selector: 'app-coin-listing',
  templateUrl: './coin-listing.component.html',
  styleUrls: ['./coin-listing.component.css']
})
export class CoinListingComponent implements OnInit {
  displayColumns: string[] = ['code','description'];
  dataSource!: MatTableDataSource<Coin>;
  filter = '';
  pageSize = 5;

  constructor (
    private dataRequests: DataRequestsService
  ) { }

  ngOnInit(): void {
    this.dataRequests.getCoins().pipe(first())
    .subscribe(
      response => this.dataSource = new MatTableDataSource<Coin>(response)
    )
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
    const coins: Coin[] = this.dataSource.data;

    if (this.pageSize > coins.length) {
      this.pageSize = coins.length;
    }
    if (!this.pageSize || this.pageSize <= 0) {
      this.pageSize = 1;
    }

    this.paginator._changePageSize(this.pageSize);
  }

  applyfilter() {
    this.dataSource.filter = this.filter;
  }
}
