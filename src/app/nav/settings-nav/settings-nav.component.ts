import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { LanguageCache } from 'src/app/models/cache/language-cache';
import { Language } from 'src/app/models/util/language';
import { LanugageService } from 'src/app/services/lanugage.service';

@Component({
  selector: 'app-settings-nav',
  templateUrl: './settings-nav.component.html',
  styleUrls: ['./settings-nav.component.css']
})
export class SettingsNavComponent implements OnInit {
  languages: Observable<Language[]>;

  get languageId(): number {
    return this.languageCache.getLanguageId();
  }

  constructor(
    private updates: SwUpdate,
    private router: Router,
    private apollo: Apollo,
    private service: LanugageService,
    private languageCache: LanguageCache
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
    this.languageCache.setLanguageId(langId);
    this.apollo.client.clearStore();
    this.apollo.client.resetStore();
    location.replace('/');
  }
}
