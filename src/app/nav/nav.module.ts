import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavRoutingModule } from './nav-routing.module';
import { MainNavComponent } from './main-nav/main-nav.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { SettingsNavComponent } from './settings-nav/settings-nav.component';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    MainNavComponent,
    SettingsNavComponent
  ],
  imports: [
    CommonModule,
    NavRoutingModule,
    MatSidenavModule,
    MatIconModule,
    MatSelectModule
  ]
})
export class NavModule { }
