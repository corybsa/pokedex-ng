import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LanguageCache } from '../models/cache/language-cache';
import { Language } from '../models/util/language';

@Injectable({
  providedIn: 'root'
})
export class LanugageService {

  constructor(
    private apollo: Apollo,
    private languageCache: LanguageCache
  ) { }

  getLanguages(): Observable<Language[]> {
    const langs = this.languageCache.getLanguages();

    if(langs) {
      return new Observable(o => {
        o.next(langs);
        o.complete();
      });
    }

    return this.apollo.watchQuery({
      query: gql`
        query getLanguages${environment.name} {
          pokemon_v2_language(where: {pokemonV2LanguagenamesByLocalLanguageId: {id: {_is_null: false}}}) {
            id
            name
            pokemonV2LanguagenamesByLocalLanguageId {
              language_id
              name
            }
          }
        }
      `
    }).valueChanges.pipe(
      map((res: any) => {
        const languages: Language[] = [];

        for(let language of res.data.pokemon_v2_language) {
          languages.push({
            id: language.id,
            name: language.pokemonV2LanguagenamesByLocalLanguageId.find((item: any) => item.language_id === language.id).name
          });
        }

        this.languageCache.setLanguages(languages);

        return languages;
      })
    )
  }
}
