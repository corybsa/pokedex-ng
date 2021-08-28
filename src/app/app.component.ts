import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'pokedex';

  @ViewChild('drawer') drawer!: MatDrawer;

  constructor(
    private router: Router,
    private updates: SwUpdate,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.updates.available.subscribe(event => {
      this.snackBar.open('Update available', 'Refresh').onAction().subscribe(() => {
        this.updates.activateUpdate().then(() => {
          localStorage.clear();
          document.location.reload();
        });
      });
    });
  }

  goToPokedex() {
    this.router.navigate(['/pokedex']);
  }

  clearData() {
    localStorage.clear();
    location.replace('/');
  }

  checkForUpdates() {
    this.updates.checkForUpdate();
  }
}
