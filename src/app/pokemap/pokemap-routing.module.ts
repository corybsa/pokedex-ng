import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PokemapIndexComponent } from './pokemap-index/pokemap-index.component';
import { PokemapLocationComponent } from './pokemap-location/pokemap-location.component';

const routes: Routes = [
  { path: '', component: PokemapIndexComponent },
  { path: ':locationId', component: PokemapLocationComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PokemapRoutingModule { }
