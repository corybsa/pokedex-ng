import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TypedexRoutingModule } from './typedex-routing.module';
import { TypedexIndexComponent } from './typedex-index/typedex-index.component';


@NgModule({
  declarations: [
    TypedexIndexComponent
  ],
  imports: [
    CommonModule,
    TypedexRoutingModule
  ]
})
export class TypedexModule { }
