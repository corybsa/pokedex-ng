import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavRoutingModule } from './nav-routing.module';
import { MainNavComponent } from './main-nav/main-nav.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { SettingsNavComponent } from './settings-nav/settings-nav.component';

@NgModule({
  declarations: [
    MainNavComponent,
    SettingsNavComponent
  ],
  imports: [
    CommonModule,
    NavRoutingModule,
    MatSidenavModule,
    MatIconModule
  ]
})
export class NavModule { }
