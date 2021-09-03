import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { PokemonMove } from '../models/pokemon/pokemon-move.model';
import * as _ from 'underscore';
import { LanguageCache } from '../models/cache/language-cache';
import { MoveCache } from '../models/cache/move-cache';

@Injectable({
  providedIn: 'root'
})
export class PokemonMovesService {

  constructor(
    private apollo: Apollo,
    private languageCache: LanguageCache,
    private moveCache: MoveCache
  ) { }

  getMovesLearnedByLevelUp(pokemonId: number): Observable<PokemonMove[]> {
    const list = this.moveCache.getMoves(pokemonId);

    if(list) {
      return new Observable(o => {
        o.next(list);
        o.complete();
      });
    }

    const method = 1; // level up

    // TODO: store version in localStorage and pass it as variable
    const generationId = 7; // gen 7

    return this.apollo.watchQuery({
      query: gql`
        query getMovesLearnedByLevelUp${environment.name}($pokemonId: Int!, $generationId: Int!, $method: Int!, $languageId: Int!) {
          pokemon_v2_pokemonmove(where: {pokemon_id: {_eq: $pokemonId}, move_learn_method_id: {_eq: $method}, pokemon_v2_versiongroup: {generation_id: {_eq: $generationId}}}, distinct_on: move_id) {
            level
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
        generationId: generationId,
        method: method,
        languageId: this.languageCache.getLanguageId()
      }
    }).valueChanges.pipe(
      map((res: any) => {
        const moves = res.data.pokemon_v2_pokemonmove;
        let pokemonMoves: PokemonMove[] = [];

        for(let move of moves) {
          pokemonMoves.push({
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

        pokemonMoves = _.sortBy(pokemonMoves, move => Math.min(move.levelLearned));
        this.moveCache.addMoves(pokemonId, pokemonMoves);

        return pokemonMoves;
      }),
      catchError(() => {
        const list = this.moveCache.getMoves(pokemonId);
        let res: PokemonMove[] = [];

        if(list) {
          res = list;
        }

        return new Observable<PokemonMove[]>(o => {
          o.next(res);
          o.complete();
        });
      })
    );
  }
}
