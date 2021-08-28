import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pokedex/pokedex.module').then(m => m.PokdexModule)
  },
  {
    path: 'pokedex',
    loadChildren: () => import('./pokedex/pokedex.module').then(m => m.PokdexModule)
  },
  {
    path: 'typedex',
    loadChildren: () => import('./typedex/typedex.module').then(m => m.TypedexModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
