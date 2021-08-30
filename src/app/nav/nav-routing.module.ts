import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainNavComponent } from './main-nav/main-nav.component';
import { SettingsNavComponent } from './settings-nav/settings-nav.component';

const routes: Routes = [
  { path: '', outlet: 'nav', component: MainNavComponent },
  { path: 'settings', outlet: 'nav', component: SettingsNavComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NavRoutingModule { }
