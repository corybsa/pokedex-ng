import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { Language } from 'src/app/models/util/language';
import { Storage } from 'src/app/models/util/storage';
import { LanugageService } from 'src/app/services/lanugage.service';

@Component({
  selector: 'app-settings-nav',
  templateUrl: './settings-nav.component.html',
  styleUrls: ['./settings-nav.component.css']
})
export class SettingsNavComponent implements OnInit {
  languages: Observable<Language[]>;

  constructor(
    private updates: SwUpdate,
    private router: Router,
    private apollo: Apollo,
    private service: LanugageService,
    public storage: Storage
  ) {
    this.languages = this.service.getLanguages();
  }

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

  changeLanguage(langId: number) {
    this.storage.setLanguageId(langId);
    this.apollo.client.clearStore();
    this.apollo.client.resetStore();
    location.replace('/');
  }
}
