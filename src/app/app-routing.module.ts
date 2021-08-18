import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PokedexEntryComponent } from './pokedex-entry/pokedex-entry.component';
import { PokedexIndexComponent } from './pokedex-index/pokedex-index.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'pokedex'
  },
  {
    path: 'pokedex',
    children: [
      { path: '', component: PokedexIndexComponent },
      { path: ':id', component: PokedexEntryComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
