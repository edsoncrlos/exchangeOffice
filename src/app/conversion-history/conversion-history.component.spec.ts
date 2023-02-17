import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { of } from 'rxjs';
import { SessionStorageService } from '../core/session-storage.service';

import { ConversionHistoryComponent } from './conversion-history.component';
import { mockDisplayColumns, mockHistoric, SessionStorageServiceStub } from './conversion-history.component.doubles';

describe('ConversionHistoryComponent', () => {
  let component: ConversionHistoryComponent;
  let fixture: ComponentFixture<ConversionHistoryComponent>;
  let dialogRefSpyObj = jasmine.createSpyObj({ afterClosed : of(true), close: null });
  dialogRefSpyObj.componentInstance = { body: '' };

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      declarations: [ ConversionHistoryComponent ],
      imports: [
        MatDialogModule,
        MatTableModule,
        MatIconModule
      ],
      providers: [
        { provide: SessionStorageService, useValue: SessionStorageServiceStub },
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ConversionHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check if displayColumns have value', () => {
    expect(component.displayColumns).toBeTruthy();
    expect(component.displayColumns.length).toBe(7);
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
        const cells = rows.querySelectorAll('.conversion-data');

        const [ date, hourAndMinutes, amount, originCoin, destinationCoin, result, rate ] = [
          cells[0], cells[1], cells[2], cells[3], cells[4], cells[5], cells[6]
        ];

        const [dayMock, monthMock, yearMock] = mockHistoric[i].date.split('/');
        const dateMock = monthMock+'/'+dayMock+'/'+yearMock;

        expect(date.textContent).toContain(dateMock);
        expect(hourAndMinutes.textContent).toContain(mockHistoric[i].hourAndMinutes);
        expect(amount.textContent).toContain(mockHistoric[i].amount.toString());
        expect(originCoin.textContent).toContain(mockHistoric[i].originCoin);
        expect(destinationCoin.textContent).toContain(mockHistoric[i].destinationCoin);
        expect(result.textContent).toContain(mockHistoric[i].result.toString());
        expect(rate.textContent).toContain(mockHistoric[i].rate.toString());
      });

      done();
    });
  });

  it ('should show icons of money for conversion when hasShowIcon is true', (done: DoneFn) => {

    fixture.whenStable().then(() => {
      fixture.detectChanges();

      const rows: NodeListOf<Element> = fixture.nativeElement.querySelectorAll('table tbody tr');

      rows.forEach((cell, i) => {
        const icon = cell.querySelector('.money-icon');

        if (mockHistoric[i].hasShowIcon) {
          expect(icon).toBeDefined();
        } else {
          expect(icon).toBeNull();
        }
      });

      done();
    });
  });

  it('should not render table when array is empty and show alternative message', () => {
    component.dataSource.data = [];
    fixture.detectChanges();

    const noHistoric: HTMLElement = fixture.nativeElement.querySelector('.no-historic');

    expect(noHistoric.textContent)
      .toContain('não realizou nenhuma conversão');
  });

  it('should call openDialog functions when button is clicked', (done: DoneFn) => {

    fixture.whenStable().then(() => {
      fixture.detectChanges();

      spyOn(component, 'openDialog').and.callThrough();
      spyOn(component['dialog'], 'open').and.returnValue(dialogRefSpyObj);
      spyOn(component, 'deleteHistoric');

      const index = 2;
      const button: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('button');
      button[index].click();

      fixture.detectChanges();
      expect(component.openDialog).toHaveBeenCalled();
      expect(component.openDialog).toHaveBeenCalledWith(index);

      expect(component['dialog'].open).toHaveBeenCalled();

      expect(component.deleteHistoric).toHaveBeenCalled();
      expect(component.deleteHistoric)
        .withContext('Should deleteHistoric called with a value of openDialog')
        .toHaveBeenCalledWith(index);

      done();
    });
  });


  it ('Should delete the Value from table and update it', () => {

    spyOn(component, 'deleteHistoric').and.callThrough();
    spyOn(component['sessionStorage'], 'setItem');
    const mockAfterDelete = [mockHistoric[0], mockHistoric[2]];

    component.deleteHistoric(1);
    component.deleteHistoric(3);

    expect(component.dataSource.data).not.toEqual(mockHistoric);
    expect(component.deleteHistoric).toHaveBeenCalledTimes(2);
    expect(component.dataSource.data)
      .withContext('should update value of dataSource.data')
      .toEqual(mockAfterDelete);

    expect(component['sessionStorage'].setItem).toHaveBeenCalledTimes(2);
    expect(component['sessionStorage'].setItem).toHaveBeenCalledWith('historic', mockAfterDelete);
  })
});
