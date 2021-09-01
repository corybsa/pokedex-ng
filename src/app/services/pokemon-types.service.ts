import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PokemonTypeEfficacies } from '../models/pokemon/pokemon-type-efficacies.model';
import { Storage } from '../models/util/storage';
import * as _ from 'underscore';
import { PokemonType } from '../models/pokemon/pokemon-type.model';
import { PokemonTypes } from '../models/util/pokemon-types.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PokemonTypesService {

  constructor(
    private storage: Storage,
    private apollo: Apollo
  ) { }

  getTypeEfficacies(pokemonId: number): Observable<PokemonTypeEfficacies> {
    const efficacies = this.storage.getEfficacies(pokemonId);

    if(efficacies) {
      return new Observable(o => {
        o.next(efficacies);
        o.complete();
      });
    }

    return this.apollo.watchQuery({
      query: gql`
        query getPokemonTypes${environment.name}($pokemonId: Int!, $languageId: Int!) {
          pokemon_v2_pokemontype(where: {pokemon_v2_pokemon: {id: {_eq: $pokemonId}}}) {
            pokemon_v2_type {
              pokemonV2TypeefficaciesByTargetTypeId {
                damage_factor
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
        }
      `,
      variables: {
        pokemonId: pokemonId,
        languageId: this.storage.getLanguageId()
      }
    }).valueChanges.pipe(
      map((res: any) => {
        const types = res.data.pokemon_v2_pokemontype;
        const allTypes = [];
        const efficacies: PokemonTypeEfficacies = {
          pokemonId: pokemonId,
          zeroDamage: [],
          quarterDamage: [],
          halfDamage: [],
          normalDamage: [],
          doubleDamage: [],
          quadDamage: []
        };
        const damageRelations = [];
        const index = [];
        index[0] = 'zero';
        index[50] = 'half';
        index[100] = 'normal';
        index[200] = 'double';

        for(let type of types) {
          const rel: any = {
            zero: [],
            half: [],
            normal: [],
            double: []
          };

          for(let e of type.pokemon_v2_type.pokemonV2TypeefficaciesByTargetTypeId) {
            rel[index[e.damage_factor]].push(e.pokemon_v2_type.id);

            allTypes.push({
              id: e.pokemon_v2_type.id,
              name: e.pokemon_v2_type.name,
              localeName: e.pokemon_v2_type.pokemon_v2_typenames[0].name
            });
          }

          damageRelations.push(rel);
        }

        // pokemon has two types
        if(damageRelations.length === 2) {
          const halfDamage: number[] = _.union(damageRelations[0].half, damageRelations[1].half);
          const doubleDamage: number[] = _.union(damageRelations[0].double, damageRelations[1].double);
          
          let zeroIds: number[] = _.union(damageRelations[0].zero, damageRelations[1].zero);
          let halfIds: number[] = _.without(halfDamage, ...doubleDamage);
          let quarterIds: number[] = _.intersection(damageRelations[0].half, damageRelations[1].half);
          halfIds = _.difference(halfIds, quarterIds);
          let quadIds: number[] = _.intersection(damageRelations[0].double, damageRelations[1].double);
          let doubleIds: number[] = _.without(_.difference(doubleDamage, halfDamage), ...quadIds);
          let normalIds: number[] = _.without(
            _.difference(
              PokemonTypes.IDs,
              halfIds,
              doubleIds,
              quarterIds,
              quadIds
            ),
            ...zeroIds
          );

          efficacies.zeroDamage = this.findTypes(allTypes, zeroIds)
          efficacies.quarterDamage = this.findTypes(allTypes, quarterIds)
          efficacies.halfDamage = this.findTypes(allTypes, halfIds)
          efficacies.normalDamage = this.findTypes(allTypes, normalIds)
          efficacies.doubleDamage = this.findTypes(allTypes, doubleIds)
          efficacies.quadDamage = this.findTypes(allTypes, quadIds)
        } else {
          efficacies.zeroDamage = this.findTypes(allTypes, damageRelations[0].zero);
          efficacies.halfDamage = this.findTypes(allTypes, damageRelations[0].half);
          efficacies.normalDamage = this.findTypes(allTypes, damageRelations[0].normal);
          efficacies.doubleDamage = this.findTypes(allTypes, damageRelations[0].double);
        }

        this.storage.addEfficacies(efficacies);

        return efficacies;
      })
    );
  }

  private findTypes(types: PokemonType[], idsToFind: number[]): PokemonType[] {
    if(idsToFind.length === 0) {
      return [];
    }

    const res: PokemonType[] = [];

    for(let id of idsToFind) {
      const type = types.find(item => item.id === id);

      if(type) {
        res.push(type);
      }
    }

    return res;
  }
}
