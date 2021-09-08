import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PokemapRoutingModule } from './pokemap-routing.module';
import { PokemapIndexComponent } from './pokemap-index/pokemap-index.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PokemapLocationComponent } from './pokemap-location/pokemap-location.component';
import { MatIconModule } from '@angular/material/icon';


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
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ]
})
export class PokemapModule { }
