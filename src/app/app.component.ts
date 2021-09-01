import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { SwUpdate } from '@angular/service-worker';
import {MatSnackBar} from '@angular/material/snack-bar';
import { Apollo } from 'apollo-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('drawer') drawer!: MatDrawer;

  constructor(
    private updates: SwUpdate,
    private snackBar: MatSnackBar,
    private apollo: Apollo
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
}
