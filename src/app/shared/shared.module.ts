import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';

import { MenuComponent } from './menu/menu.component';


@NgModule({
  declarations: [
    MenuComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    RouterModule
  ],
  exports: [
    MenuComponent
  ]
})
export class SharedModule { }
