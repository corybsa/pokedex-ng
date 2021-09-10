import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Apollo, gql } from 'apollo-angular';
import { PokemonListItem } from '../models/pokemon/pokemon-list-item.model';
import { PokemonType } from '../models/pokemon/pokemon-type.model';
import { Pokemon } from '../models/pokemon/pokemon.model';
import * as _ from 'underscore';
import { environment } from 'src/environments/environment';
import { PokemonListCache } from '../models/cache/pokemon-list-cache';
import { LanguageCache } from '../models/cache/language-cache';
import { PokemonCache } from '../models/cache/pokemon-cache';

@Injectable({
  providedIn: 'root'
})
export class PokedexService {
  constructor(
    private apollo: Apollo,
    private languageCache: LanguageCache,
    private pokemonListCache: PokemonListCache,
    private pokemonCache: PokemonCache
  ) {}

  getPokemonList(): Observable<PokemonListItem[]> {
    const list = this.pokemonListCache.getList();

    if(list) {
      return new Observable(o => {
        o.next(list);
        o.complete();
      });
    }

    return this.apollo.watchQuery({
      query: gql`
        query getPokemonList${environment.name}($languageId: Int!) {
          pokemon_v2_pokemonspecies(order_by: {id: asc}) {
            id
            name
            pokemon_v2_pokemons {
              id
              name
              pokemon_v2_pokemontypes {
                pokemon_v2_type {
                  id
                  name
                  pokemon_v2_typenames(where: {language_id: {_eq: $languageId}}) {
                    name
                  }
                }
              }
            }
            pokemon_v2_pokemonspeciesnames(where: {language_id: {_eq: $languageId}}) {
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
        const list: PokemonListItem[] = [];

        for(let pokemon of res.data.pokemon_v2_pokemonspecies) {
          let types: PokemonType[] = [];
          let item: PokemonListItem = {} as PokemonListItem;
          item.id = pokemon.id;
          item.name = pokemon.name;
          item.localeName = pokemon.pokemon_v2_pokemonspeciesnames[0].name;

          for(let type of pokemon.pokemon_v2_pokemons) {
            if(type.id === pokemon.id) {
              if(type.pokemon_v2_pokemontypes[0]) {
                types.push({
                  id: type.pokemon_v2_pokemontypes[0].pokemon_v2_type.id,
                  name: type.pokemon_v2_pokemontypes[0].pokemon_v2_type.name,
                  localeName: type.pokemon_v2_pokemontypes[0].pokemon_v2_type.pokemon_v2_typenames[0].name
                });
              }

              if(type.pokemon_v2_pokemontypes[1]) {
                types.push({
                  id: type.pokemon_v2_pokemontypes[1].pokemon_v2_type.id,
                  name: type.pokemon_v2_pokemontypes[1].pokemon_v2_type.name,
                  localeName: type.pokemon_v2_pokemontypes[1].pokemon_v2_type.pokemon_v2_typenames[0].name
                });
              }
            }
          }

          item.types = types;
          list.push(item);
        }

        this.pokemonListCache.setList(list);

        return list;
      })
    );
  }

  getPokemon(id: number): Observable<Pokemon> {
    const p = this.pokemonCache.getPokemon(id);

    if(p) {
      return new Observable(o => {
        o.next(p);
        o.complete();
      });
    }

    return this.apollo.watchQuery({
      query: gql`
        query getPokemon${environment.name}($pokemonId: Int!, $languageId: Int!) {
          pokemon_v2_pokemon(where: {id: {_eq: $pokemonId}}) {
            id
            name
            height
            weight
            pokemon_v2_pokemonspecy {
              evolution_chain_id
              pokemon_v2_pokemonspeciesnames(where: {language_id: {_eq: $languageId}}) {
                name
              }
            }
            pokemon_v2_pokemontypes {
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
        pokemonId: id,
        languageId: this.languageCache.getLanguageId()
      }
    }).valueChanges.pipe(
      map((res: any) => {
        const p = res.data.pokemon_v2_pokemon[0];
        const pokemon = {} as Pokemon;

        pokemon.id = p.id;
        pokemon.name = p.name;
        pokemon.localeName = p.pokemon_v2_pokemonspecy.pokemon_v2_pokemonspeciesnames[0].name;
        pokemon.height = p.height;
        pokemon.weight = p.weight;
        pokemon.evolutionChainId = p.pokemon_v2_pokemonspecy.evolution_chain_id;
        pokemon.types = [{
          id: p.pokemon_v2_pokemontypes[0].pokemon_v2_type.id,
          name: p.pokemon_v2_pokemontypes[0].pokemon_v2_type.name,
          localeName: p.pokemon_v2_pokemontypes[0].pokemon_v2_type.pokemon_v2_typenames[0].name 
        }];

        if(p.pokemon_v2_pokemontypes[1]) {
          pokemon.types.push({
            id: p.pokemon_v2_pokemontypes[1].pokemon_v2_type.id,
            name: p.pokemon_v2_pokemontypes[1].pokemon_v2_type.name,
            localeName: p.pokemon_v2_pokemontypes[1].pokemon_v2_type.pokemon_v2_typenames[0].name
          });
        }

        this.pokemonCache.addPokemon(pokemon);

        return pokemon;
      })
    );
  }
}
