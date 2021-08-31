import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'pokedex',
    loadChildren: () => import('./pokedex/pokedex.module').then(m => m.PokdexModule)
  },
  {
    path: 'typedex',
    loadChildren: () => import('./typedex/typedex.module').then(m => m.TypedexModule)
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'pokedex'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
