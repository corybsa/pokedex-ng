import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PokemonMove } from '../models/pokemon/pokemon-move.model';
import { Storage } from '../models/util/storage';

@Injectable({
  providedIn: 'root'
})
export class PokemonMovesService {

  constructor(
    private apollo: Apollo,
    private storage: Storage
  ) { }

  getMovesLearnedByLevelUp(pokemonId: number): Observable<PokemonMove[]> {
    const list = this.storage.getMoves(pokemonId);

    if(list) {
      return new Observable(o => {
        o.next(list);
        o.complete();
      });
    }

    // TODO: store version in localStorage and put it in the query string
    const levelUp = 1;

    return this.apollo.watchQuery({
      query: gql`
        {
          pokemon_v2_pokemonmove(where: {pokemon_id: {_eq: ${pokemonId}}, version_group_id: {_eq: 18}, move_learn_method_id: {_eq: ${levelUp}}}, order_by: {level: asc, version_group_id: desc}) {
            level
            pokemon_v2_move {
              power
              pp
              accuracy
              move_effect_chance
              pokemon_v2_movenames(where: {language_id: {_eq: ${this.storage.getLanguageId()}}}) {
                name
              }
              pokemon_v2_movedamageclass {
                pokemon_v2_movedamageclassnames(where: {language_id: {_eq: ${this.storage.getLanguageId()}}}) {
                  name
                }
              }
              pokemon_v2_moveeffect {
                pokemon_v2_moveeffecteffecttexts(where: {language_id: {_eq: ${this.storage.getLanguageId()}}}) {
                  short_effect
                }
              }
              pokemon_v2_type {
                id
                name
                pokemon_v2_typenames(where: {language_id: {_eq: ${this.storage.getLanguageId()}}}) {
                  name
                }
              }
            }
          }
        }
      `
    }).valueChanges.pipe(
      map((res: any) => {
        const moves = res.data.pokemon_v2_pokemonmove;
        const pokemonMoves: PokemonMove[] = [];

        for(let move of moves) {
          pokemonMoves.push({
            localeName: move.pokemon_v2_move.pokemon_v2_movenames[0].name,
            localeEffect: move.pokemon_v2_move.pokemon_v2_moveeffect.pokemon_v2_moveeffecteffecttexts[0].short_effect.replace('$effect_chance', move.pokemon_v2_move.move_effect_chance),
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

        this.storage.addMoves(pokemonId, pokemonMoves);

        return pokemonMoves;
      }),
      catchError(() => {
        const list = this.storage.getMoves(pokemonId);
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
