import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import * as _ from 'underscore';
import { LanguageCache } from '../models/cache/language-cache';
import { MoveCache } from '../models/cache/move-cache';
import { GenerationCache } from '../models/cache/generation-cache';
import { PokemonVersionMove } from '../models/pokemon/pokemon-version-move.model';

@Injectable({
  providedIn: 'root'
})
export class PokemonMovesService {

  constructor(
    private apollo: Apollo,
    private languageCache: LanguageCache,
    private moveCache: MoveCache,
    private generationCache: GenerationCache
  ) { }

  getMovesLearnedByLevelUp(pokemonId: number): Observable<PokemonVersionMove[]> {
    const list = this.moveCache.getMoves(pokemonId);

    if(list) {
      return new Observable(o => {
        o.next(list);
        o.complete();
      });
    }

    return this.apollo.watchQuery({
      query: gql`
        query getMovesLearnedByLevelUp${environment.name}($pokemonId: Int!, $generationId: Int!, $method: Int!, $languageId: Int!) {
          pokemon_v2_pokemonmove(where: {pokemon_id: {_eq: $pokemonId}, move_learn_method_id: {_eq: $method}, pokemon_v2_versiongroup: {generation_id: {_eq: $generationId}}}) {
            level
            pokemon_v2_versiongroup {
              id
              pokemon_v2_versions {
                pokemon_v2_versionnames(where: {language_id: {_eq: $languageId}}) {
                  name
                }
              }
            }
            pokemon_v2_move {
              power
              pp
              accuracy
              move_effect_chance
              pokemon_v2_movenames(where: {language_id: {_eq: $languageId}}) {
                name
              }
              pokemon_v2_movedamageclass {
                pokemon_v2_movedamageclassnames(where: {language_id: {_eq: $languageId}}) {
                  name
                }
              }
              pokemon_v2_moveeffect {
                pokemon_v2_moveeffecteffecttexts(where: {language_id: {_eq: $languageId}}) {
                  short_effect
                }
              }
              pokemon_v2_type {
                id
                name
                pokemon_v2_typenames(where: {language_id: {_eq: $languageId}}) {
                  name
                }
              }
            }
          }
        }
      `,
      variables: {
        pokemonId: pokemonId,
        generationId: this.generationCache.getGenerationId(),
        method: 1, // level up
        languageId: this.languageCache.getLanguageId()
      }
    }).valueChanges.pipe(
      map((res: any) => {
        const moves = res.data.pokemon_v2_pokemonmove;
        const temp: any[] = [];
        const final: PokemonVersionMove[] = [];

        for(let move of moves) {
          temp.push({
            versionId: move.pokemon_v2_versiongroup.id,
            versionName: _.map(move.pokemon_v2_versiongroup.pokemon_v2_versions, item => item.pokemon_v2_versionnames[0].name).join('/'),
            localeName: move.pokemon_v2_move.pokemon_v2_movenames[0].name,
            localeEffect: move.pokemon_v2_move.pokemon_v2_moveeffect.pokemon_v2_moveeffecteffecttexts[0]?.short_effect.replace('$effect_chance', move.pokemon_v2_move.move_effect_chance),
            localeClass: move.pokemon_v2_move.pokemon_v2_movedamageclass.pokemon_v2_movedamageclassnames[0].name,
            levelLearned: move.level,
            power: move.pokemon_v2_move.power,
            powerPoints: move.pokemon_v2_move.pp,
            accuracy: move.pokemon_v2_move.accuracy,
            type: {
              id: move.pokemon_v2_move.pokemon_v2_type.id,
              name: move.pokemon_v2_move.pokemon_v2_type.name,
              localeName: move.pokemon_v2_move.pokemon_v2_type.pokemon_v2_typenames[0].name
            }
          });
        }

        for(let t of temp) {
          const version = final.find(item => item.versionId === t.versionId);

          if(version) {
            version.moves.push({
              localeName: t.localeName,
              localeEffect: t.localeEffect,
              localeClass: t.localeClass,
              levelLearned: t.levelLearned,
              power: t.power,
              powerPoints: t.powerPoints,
              accuracy: t.accuracy,
              type: t.type
            });
          } else {
            final.push({
              versionId: t.versionId,
              versionName: t.versionName,
              moves: [{
                localeName: t.localeName,
                localeEffect: t.localeEffect,
                localeClass: t.localeClass,
                levelLearned: t.levelLearned,
                power: t.power,
                powerPoints: t.powerPoints,
                accuracy: t.accuracy,
                type: t.type
              }]
            });
          }
        }

        for(let version of final) {
          version.moves = _.sortBy(version.moves, move => Math.min(move.levelLearned));
        }
        
        this.moveCache.addMoves(pokemonId, final);

        return final;
      })
    );
  }
}
