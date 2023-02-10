import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort} from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

import { SessionStorageService } from '../core/session-storage.service';
import { Historic } from './conversion-history.interfaces';
import { DialogComponent } from './dialog/dialog.component';

@Component({
  selector: 'app-conversion-history',
  templateUrl: './conversion-history.component.html',
  styleUrls: ['./conversion-history.component.css']
})
export class ConversionHistoryComponent implements OnInit, AfterViewInit {
  displayColumns: string[] = ['date', 'hourAndMinutes', 'amount', 'originCoin', 'destinationCoin', 'result', 'rate'];
  dataSource!: MatTableDataSource<Historic>;

  constructor(
    private sessionStorage: SessionStorageService<Historic>,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    const historic: Historic[] = this.sessionStorage.getItem('historic').map(
      (historic, index) => {
        historic.id = index;
        return historic;
      }
    );

    this.dataSource = new MatTableDataSource<Historic>(historic);
  }

  @ViewChild(MatSort) sort!: MatSort;
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  openDialog(index: number) {
    const dialogRef = this.dialog.open(DialogComponent)

    dialogRef.afterClosed().subscribe(
      isDelete => {
        if (isDelete) {
          this.deleteHistoric(index)
        }
      }
    )
  }

  deleteHistoric(index: number) {
    const historic: Historic[] = this.dataSource.data.filter(data => data.id != index);

    this.dataSource.data = historic;
    this.sessionStorage.setItem('historic', historic);
  }
}
