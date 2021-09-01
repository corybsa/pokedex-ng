import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { Apollo } from 'apollo-angular';

@Component({
  selector: 'app-settings-nav',
  templateUrl: './settings-nav.component.html',
  styleUrls: ['./settings-nav.component.css']
})
export class SettingsNavComponent implements OnInit {

  constructor(
    private updates: SwUpdate,
    private router: Router,
    private apollo: Apollo
  ) { }

  ngOnInit(): void {
  }

  clearData() {
    this.apollo.client.clearStore();
    this.apollo.client.resetStore();
    localStorage.clear();
    location.replace('/');
  }

  checkForUpdates() {
    if(this.updates.isEnabled) {
      this.updates.checkForUpdate();
    }
  }

  backToMain() {
      this.router.navigate([{ outlets: { nav: null } }]);
  }
}
