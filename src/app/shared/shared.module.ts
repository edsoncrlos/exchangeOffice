import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AppMaterialModule } from './app-material/app-material.module';

import { MenuComponent } from './menu/menu.component';


@NgModule({
  declarations: [
    MenuComponent
  ],
  imports: [
    AppMaterialModule,
    CommonModule,
    RouterModule
  ],
  exports: [
    AppMaterialModule,
    MenuComponent
  ]
})
export class SharedModule { }
