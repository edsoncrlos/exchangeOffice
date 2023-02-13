import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { SessionStorageService } from '../core/session-storage.service';

import { ConversionHistoryComponent } from './conversion-history.component';
import { mockHistoric, SessionStorageServiceStumb } from './conversion-history.component.doubles';

const mockDisplayColumns = ['Data', 'Hora', 'Quantidade', 'Moeda de origem', 'Moeda de destino', 'Resultado', 'Taxa'];

describe('ConversionHistoryComponent', () => {
  let component: ConversionHistoryComponent;
  let fixture: ComponentFixture<ConversionHistoryComponent>;
  let matDialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    const mockMatDialog = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      declarations: [ ConversionHistoryComponent ],
      imports: [
        MatDialogModule,
        MatTableModule,
        MatIconModule
      ],
      providers: [
        { provide: SessionStorageService, useValue: SessionStorageServiceStumb },
        { provide: MatDialog, useVale: mockMatDialog }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ConversionHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    matDialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
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

  it('should not render table when array is empty and show alternative message', () => {
    component.dataSource.data = [];
    fixture.detectChanges();

    const noHistoric: HTMLElement = fixture.nativeElement.querySelector('.no-historic');

    expect(noHistoric.textContent)
      .toContain('não realizou nenhuma conversão');
  });

  it ('should open dialog when button is clicked', (done: DoneFn) => {

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      spyOn(component, 'openDialog');
      const button: HTMLElement = fixture.nativeElement.querySelector('button');
      button.click();

      fixture.detectChanges();
      expect(component.openDialog).toHaveBeenCalled();
      expect(component.openDialog).toHaveBeenCalledWith(0);

      done();
    });
  });

  it ('Should deleteHistoric called with a value', () => {
    spyOn(component, 'deleteHistoric').and.callThrough();

    component.deleteHistoric(0);

    expect(component.deleteHistoric).toHaveBeenCalled();
    expect(component.deleteHistoric).toHaveBeenCalledWith(0);
  });
});
