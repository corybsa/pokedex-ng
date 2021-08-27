import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PokdexRoutingModule } from './pokedex-routing.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule } from '@angular/forms';
import { PokedexIndexComponent } from './pokedex-index/pokedex-index.component';
import { PokedexEntryComponent } from './pokedex-entry/pokedex-entry.component';
import { PokedexEntryMovesComponent } from './pokedex-entry-moves/pokedex-entry-moves.component';
import { PokedexEntryTypesComponent } from './pokedex-entry-types/pokedex-entry-types.component';
import { PokedexEntryEvolutionsComponent } from './pokedex-entry-evolutions/pokedex-entry-evolutions.component';
import { TypeListComponent } from './type-list/type-list.component';


@NgModule({
  declarations: [
    PokedexIndexComponent,
    PokedexEntryComponent,
    PokedexEntryMovesComponent,
    PokedexEntryTypesComponent,
    PokedexEntryEvolutionsComponent,
    TypeListComponent
  ],
  imports: [
    CommonModule,
    PokdexRoutingModule,
    FormsModule,
    MatPaginatorModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatSidenavModule,
    MatInputModule,
    MatTabsModule
  ]
})
export class PokdexModule { }
