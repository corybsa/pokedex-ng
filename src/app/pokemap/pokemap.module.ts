import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PokemapRoutingModule } from './pokemap-routing.module';
import { PokemapIndexComponent } from './pokemap-index/pokemap-index.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { PokemapLocationComponent } from './pokemap-location/pokemap-location.component';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    PokemapIndexComponent,
    PokemapLocationComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PokemapRoutingModule,
    MatExpansionModule,
    MatCardModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule
  ]
})
export class PokemapModule { }
