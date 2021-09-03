import { Injectable } from '@angular/core';
import { Observable } from '@apollo/client/utilities';
import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GenerationCache } from '../models/cache/generation-cache';
import { LanguageCache } from '../models/cache/language-cache';

@Injectable({
  providedIn: 'root'
})
export class GenerationsService {

  constructor(
    private apollo: Apollo,
    private languageCache: LanguageCache,
    private generationCache: GenerationCache
  ) { }

  getGenerations() {
    const gens = this.generationCache.getGenerations();

    if(gens) {
      return new Observable(o => {
        o.next(gens);
        o.complete();
      });
    }

    return this.apollo.watchQuery({
      query: gql`
        query getGenerations${environment.name}($languageId: Int!) {
          generations: pokemon_v2_generation {
            pokemon_v2_generationnames(where: {language_id: {_eq: $languageId}}) {
              generation_id
              name
            }
          }
        }
      `,
      variables: {
        languageId: this.languageCache.getLanguageId()
      }
    }).valueChanges.pipe(
      map((res: any) => {
        const data = res.data.generations;
        const generations = [];

        for(let gen of data) {
          generations.push({
            id: gen.pokemon_v2_generationnames[0].generation_id,
            name: gen.pokemon_v2_generationnames[0].name
          });
        }

        this.generationCache.setGenerations(generations);

        return generations;
      })
    )
  }
}
