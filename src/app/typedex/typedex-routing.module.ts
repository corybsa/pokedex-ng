import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TypedexIndexComponent } from './typedex-index/typedex-index.component';

const routes: Routes = [
  { path: '', component: TypedexIndexComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TypedexRoutingModule { }
