import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { MatIconModule } from '@angular/material/icon';

import { routes } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './shared/menu/menu.component';

describe('AppRouting', () => {
  let router: Router;
  let fixture: ComponentFixture<AppComponent>;
  let menuFixture: ComponentFixture<MenuComponent>;
  let location: Location;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes),
        MatIconModule
      ],
      declarations: [
        MenuComponent,
        HomeComponent
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    router.initialNavigation();
  });

  describe('home navigation', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(AppComponent);
    });

    it('should navigate to the default path home', (done: DoneFn) => {
      fixture.whenStable().then(() => {
        expect(location.path()).toBe('/home');
        done();
      });
    });

    it('should be redirect to home', (done: DoneFn) => {
      router.navigateByUrl('/ajflajlfjajfljafjlajf');

      fixture.whenStable().then(() => {
        expect(location.path()).toBe('/home');
        done();
      });
    });
  });


  describe('Links in menu Component', () => {
    beforeEach(() => {
      menuFixture = TestBed.createComponent(MenuComponent);
      menuFixture.detectChanges();
    });

    it('should navigate to coin-listing on clicking the link in menu component', (done: DoneFn) => {
      const link: HTMLElement = menuFixture.nativeElement.querySelector('a[ng-reflect-router-link="coin-listing"]');
      link.click();

      menuFixture.whenStable().then(() => {
        expect(location.path()).toBe('/coin-listing');
        done();
      });
    });

    it('should navigate to coin-converter on clicking the link in menu component', (done: DoneFn) => {
      const link: HTMLElement = menuFixture.nativeElement.querySelector('a[ng-reflect-router-link="coin-converter"]');
      link.click();

      menuFixture.whenStable().then(() => {
        expect(location.path()).toBe('/coin-converter');
        done();
      });
    });

    it('should navigate to conversion-history on clicking the link in menu component', (done: DoneFn) => {
      const link: HTMLElement = menuFixture.nativeElement.querySelector('a[ng-reflect-router-link="conversion-history"]');
      link.click();

      menuFixture.whenStable().then(() => {
        expect(location.path()).toBe('/conversion-history');
        done();
      });
    });
    it('should navigate to home on clicking the link in menu component', (done: DoneFn) => {
      router.navigateByUrl('/coin-listing');

      const link: HTMLElement = menuFixture.nativeElement.querySelector('a[ng-reflect-router-link="home"]');
      link.click();

      menuFixture.whenStable().then(() => {
        expect(location.path()).toBe('/home');
        done();
      });
    });
  });
});
