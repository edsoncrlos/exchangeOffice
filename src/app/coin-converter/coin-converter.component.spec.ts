import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { Historic } from '../conversion-history/conversion-history.interfaces';
import { ExchangeRateApiService } from '../core/exchange-rate-api.service';
import { ExchangeRateServiceStub, mockResponsesConvert } from '../core/exchange-rate-api.service.doubles';
import { SessionStorageService } from '../core/session-storage.service';
import { CoinConverterComponent } from './coin-converter.component';
import { InputAutocompleteComponent } from './input-autocomplete/input-autocomplete.component';

describe('CoinConverterComponent', () => {
  let component: CoinConverterComponent;
  let fixture: ComponentFixture<CoinConverterComponent>;
  let sessionStorageSpy: jasmine.SpyObj<SessionStorageService<Historic>>;

  beforeEach(async () => {
    const mockSessionStorage = jasmine.createSpyObj<SessionStorageService<Historic>>('SessionStorage', [ 'addItem']);

    await TestBed.configureTestingModule({
      declarations: [
        CoinConverterComponent,
        InputAutocompleteComponent
      ],
      imports: [
        MatAutocompleteModule,
        FormsModule
      ],
      providers: [
        { provide: ExchangeRateApiService, useValue: ExchangeRateServiceStub},
        { provide: SessionStorageService, useValue: mockSessionStorage }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CoinConverterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    sessionStorageSpy = TestBed.inject(SessionStorageService) as jasmine.SpyObj<SessionStorageService<Historic>>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('tests for validation of the rule of conversions greater than 10 thousand dollars', () => {
    beforeEach(() => {
      spyOn(component, 'addHistoricInSessionStorage');
    });

    it('conversion from USD should be false for values less than or equal to 10 thousand dollars', () => {
      const response = mockResponsesConvert[0];
      component.conversion$ = ExchangeRateServiceStub?.getConversionCoins?.('USD', 'BRL', 10000)!;
      component.addConversion();

      expect(component.addHistoricInSessionStorage).toHaveBeenCalled();
      expect(component.addHistoricInSessionStorage).toHaveBeenCalledWith(response, false);
    });

    it('conversion from USD should be true for values greater than to 10 thousand dollars', () => {
      const response = mockResponsesConvert[1];
      component.conversion$ = ExchangeRateServiceStub?.getConversionCoins?.('USD', 'BRL', 10001)!;
      component.addConversion();

      expect(component.addHistoricInSessionStorage).toHaveBeenCalled();
      expect(component.addHistoricInSessionStorage).toHaveBeenCalledWith(response, true);
    });

    it('conversion to USD should be false for values less than or equal to 10 thousand dollars', () => {
      const response = mockResponsesConvert[2];
      component.conversion$ = ExchangeRateServiceStub?.getConversionCoins?.('BRL', 'USD', 6000)!;
      component.addConversion();

      expect(component.addHistoricInSessionStorage).toHaveBeenCalled();
      expect(component.addHistoricInSessionStorage).toHaveBeenCalledWith(response, false);
    });

    it('conversion to USD should be true for values greater than to 10 thousand dollars', () => {
      const response = mockResponsesConvert[3];
      component.conversion$ = ExchangeRateServiceStub?.getConversionCoins?.('BRL', 'USD', 60000)!;
      component.addConversion();

      expect(component.addHistoricInSessionStorage).toHaveBeenCalled();
      expect(component.addHistoricInSessionStorage).toHaveBeenCalledWith(response, true);
    });

    it('should be true for values greater than 10 thousand dollars and call a new conversion', () => {
      const response = mockResponsesConvert[4];
      component.conversion$ = ExchangeRateServiceStub?.getConversionCoins?.('BRL', 'EUR', 52222.06)!;
      component.addConversion();

      expect(component.addHistoricInSessionStorage).toHaveBeenCalled();
      expect(component.addHistoricInSessionStorage).toHaveBeenCalledWith(response, true);
    });

    it('should be false for values less than or equal to 10 thousand dollars and call new conversion', () => {
      const response = mockResponsesConvert[6];
      component.conversion$ = ExchangeRateServiceStub?.getConversionCoins?.('BRL', 'EUR', 51890.06)!;
      component.addConversion();

      expect(component.addHistoricInSessionStorage).toHaveBeenCalled();
      expect(component.addHistoricInSessionStorage).toHaveBeenCalledWith(response, false);
    });
  });

  it('should call service sessionStorage.addItem with correct parameters', () => {
    const response = mockResponsesConvert[0];
    const hasShowIcon = false;
    const hourAndMinutes = '10:10';
    spyOn(component, 'addHistoricInSessionStorage').and.callThrough();
    spyOn(component, 'getHourAndMinutes').and.returnValue(hourAndMinutes);

    component.addHistoricInSessionStorage(response, hasShowIcon);

    expect(component.addHistoricInSessionStorage).toHaveBeenCalled();
    expect(component.addHistoricInSessionStorage).toHaveBeenCalledWith(response, hasShowIcon);
    expect(sessionStorageSpy.addItem.calls.count()).toBe(1);

    const [key, historic] = sessionStorageSpy.addItem.calls.argsFor(0);
    expect(key).toBe('historic');
    expect(historic.date).toBe(response.date);
    expect(historic.originCoin).toBe(response.query.from);
    expect(historic.destinationCoin).toBe(response.query.to);
    expect(historic.amount).toBe(response.query.amount);
    expect(historic.rate).toBe(response.info.rate);
    expect(historic.result).toBe(response.result);
    expect(historic.hasShowIcon).toBe(hasShowIcon);
    expect(historic.hourAndMinutes).toBe(hourAndMinutes);
  });
});
