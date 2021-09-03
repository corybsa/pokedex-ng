import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { GenerationCache } from 'src/app/models/cache/generation-cache';
import { LanguageCache } from 'src/app/models/cache/language-cache';
import { Generation } from 'src/app/models/util/generation.model';
import { Language } from 'src/app/models/util/language';
import { GenerationsService } from 'src/app/services/generations.service';
import { LanugageService } from 'src/app/services/lanugage.service';

@Component({
  selector: 'app-settings-nav',
  templateUrl: './settings-nav.component.html',
  styleUrls: ['./settings-nav.component.css']
})
export class SettingsNavComponent implements OnInit {
  languages: Observable<Language[]>;
  generations: Observable<Generation[]>;

  get languageId(): number {
    return this.languageCache.getLanguageId();
  }

  get generationId(): number {
    return this.generationCache.getGenerationId();
  }

  constructor(
    private updates: SwUpdate,
    private router: Router,
    private apollo: Apollo,
    private languageService: LanugageService,
    private generationService: GenerationsService,
    private languageCache: LanguageCache,
    private generationCache: GenerationCache
  ) {
    this.languages = this.languageService.getLanguages();
    this.generations = this.generationService.getGenerations();
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
    location.reload();
  }

  changeGeneration(genId: number) {
    this.generationCache.setGenerationId(genId);
    this.apollo.client.clearStore();
    this.apollo.client.resetStore();
    location.reload();
  }
}
