import { Component, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'pokedex';

  @ViewChild('drawer') drawer!: MatDrawer;

  constructor(
    private router: Router
  ) {}

  goToPokedex() {
    this.router.navigate(['/pokedex']);
  }

  clearData() {
    localStorage.clear();
    location.replace('/');
  }
}
