import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';

import { ExchangeRateApiService } from '../core/exchange-rate-api.service';
import { CoinListingComponent } from './coin-listing.component';
import { mockDisplayColumns } from './coin-listing.component.doubles';
import { ExchangeRateServiceStumb, mockCoins } from '../core/exchange-rate-api.service.doubles';

describe('CoinListingComponent', () => {
  let component: CoinListingComponent;
  let fixture: ComponentFixture<CoinListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoinListingComponent ],
      imports: [
        MatPaginatorModule,
        FormsModule,
        MatTableModule
      ],
      providers: [
        { provide: ExchangeRateApiService, useValue: ExchangeRateServiceStumb }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CoinListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check if displayColumns have value', () => {
    expect(component.displayColumns).toBeTruthy();
    expect(component.displayColumns.length).toBe(2);
  });

  it('should render the table with received data', (done: DoneFn) => {

    fixture.whenStable().then(() => {
      fixture.detectChanges();

      const table: HTMLElement = fixture.nativeElement.querySelector('table');
      expect(table).toBeTruthy();

      const columns: NodeList = table.querySelectorAll('thead th');
      columns.forEach((column, index) => {
        expect(column.textContent)
          .withContext('Should render column')
          .toContain(mockDisplayColumns[index]);
      });

      const rows = table.querySelectorAll('tbody tr');
      rows.forEach((rows, i) => {
        const cells = rows.querySelectorAll('td');

        const [ code, description ] = [ cells[0], cells[1] ];

        expect(code.textContent).toContain(mockCoins[i].code);
        expect(description.textContent).toContain(mockCoins[i].description);
      });

      done();
    });
  });

  it('should not render table when array is empty', () => {
    component.dataSource.data = [];

    fixture.detectChanges();
    const table: HTMLElement = fixture.nativeElement;

    expect(table.querySelector('table')).toBeNull();
  });

  it ('should modify pageSize to a valid value', () => {
    const pageSizeInput: HTMLInputElement = fixture.nativeElement.querySelector('#pageSize');

    pageSizeInput.value = '3';
    pageSizeInput.dispatchEvent(new Event('input'));
    expect(component.pageSize).toBe(mockCoins.length);

    pageSizeInput.value = '0';
    pageSizeInput.dispatchEvent(new Event('input'));
    expect(component.pageSize).toBe(1);

    pageSizeInput.value = '';
    pageSizeInput.dispatchEvent(new Event('input'));
    expect(component.pageSize).toBe(1);
  });
});
