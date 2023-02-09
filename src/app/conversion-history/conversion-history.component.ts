import { Component, ViewChild, AfterViewInit, OnInit} from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort} from '@angular/material/sort';

import { SessionStorageService } from '../core/session-storage.service';
import { Historic } from './conversion-history.interfaces';

@Component({
  selector: 'app-conversion-history',
  templateUrl: './conversion-history.component.html',
  styleUrls: ['./conversion-history.component.css']
})
export class ConversionHistoryComponent implements OnInit, AfterViewInit {
  displayColumns: string[] = ['date', 'hourAndMinutes', 'amount', 'originCoin', 'destinationCoin', 'result', 'rate'];
  dataSource!: MatTableDataSource<Historic>;

  constructor(
    private sessionStorage: SessionStorageService<Historic>
  ) { }

  ngOnInit() {
    const historic: Historic[] = this.sessionStorage.getItem('historic');
    this.dataSource = new MatTableDataSource<Historic>(historic);
  }

  @ViewChild(MatSort) sort!: MatSort;
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
}
