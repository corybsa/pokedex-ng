import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-settings-nav',
  templateUrl: './settings-nav.component.html',
  styleUrls: ['./settings-nav.component.css']
})
export class SettingsNavComponent implements OnInit {

  constructor(
    private updates: SwUpdate,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  clearData() {
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
