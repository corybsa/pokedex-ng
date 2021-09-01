import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import * as moment from 'moment';
import { Storage } from '../models/util/storage';
import { Apollo, gql } from 'apollo-angular';
import { PokemonListItem } from '../models/pokemon/pokemon-list-item.model';
import { PokemonType } from '../models/pokemon/pokemon-type.model';
import { Pokemon } from '../models/pokemon/pokemon.model';
import { PokemonEvolution } from '../models/pokemon/pokemon-evolution.model';
import * as _ from 'underscore';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PokedexService {
  constructor(
    private apollo: Apollo,
    private storage: Storage
  ) {}

  getPokemonList(): Observable<PokemonListItem[]> {
    const list = this.storage.getPokemonList();

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
        languageId: this.storage.getLanguageId()
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

        this.storage.setExpireTime(moment().add(1, 'week').toDate());
        this.storage.setPokemonList(list);

        return list;
      }),
      catchError(() => {
        const list = this.storage.getPokemonList();
        let res: PokemonListItem[] = [];

        if(list) {
          res = list;
        }

        return new Observable<PokemonListItem[]>(o => {
          o.next(res);
          o.complete();
        });
      })
    );
  }

  getPokemon(id: number): Observable<Pokemon> {
    const p = this.storage.getPokemon(id);

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
        languageId: this.storage.getLanguageId()
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
        pokemon.spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
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

        this.storage.addPokemon(pokemon);

        return pokemon;
      }),
      catchError(() => {
        const list = this.storage.getPokemon(id);
        let res: Pokemon = null as unknown as Pokemon; // wtf

        if(list) {
          res = list;
        }

        return new Observable<Pokemon>(o => {
          o.next(res);
          o.complete();
        });
      })
    );
  }

  getEvolutions(chainId: number): Observable<PokemonEvolution[]> {
    const list = this.storage.getEvolutions(chainId);

    if(list) {
      return new Observable(o => {
        o.next(list);
        o.complete();
      });
    }

    return this.apollo.watchQuery({
      query: gql`
        query getEvolutions${environment.name}($chainId: Int!, $languageId: Int!) {
          pokemon_v2_evolutionchain(where: {id: {_eq: $chainId}}) {
            pokemon_v2_pokemonspecies(order_by: {id: asc}) {
              id
              name
              pokemon_v2_pokemonspeciesnames(where: {language_id: {_eq: $languageId}}) {
                name
              }
              pokemon_v2_pokemonevolutions {
                evolution_item_id
                evolution_trigger_id
                evolved_species_id
                gender_id
                held_item_id
                known_move_id
                known_move_type_id
                location_id
                min_affection
                min_beauty
                min_happiness
                min_level
                needs_overworld_rain
                party_species_id
                party_type_id
                relative_physical_stats
                time_of_day
                trade_species_id
                turn_upside_down
                pokemon_v2_evolutiontrigger {
                  pokemon_v2_evolutiontriggernames(where: {language_id: {_eq: $languageId}}) {
                    name
                  }
                }
                pokemonV2ItemByHeldItemId {
                  pokemon_v2_itemnames(where: {language_id: {_eq: $languageId}}) {
                    name
                  }
                }
                pokemon_v2_item {
                  pokemon_v2_itemnames(where: {language_id: {_eq: $languageId}}) {
                    name
                  }
                }
                pokemon_v2_type {
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
        chainId: chainId,
        languageId: this.storage.getLanguageId()
      }
    }).valueChanges.pipe(
      map((res: any) => {
        const links = res.data.pokemon_v2_evolutionchain[0].pokemon_v2_pokemonspecies;
        const evolutions: PokemonEvolution[] = [];
        
        for(let link of links) {
          const evolution = {} as PokemonEvolution;
          evolution.pokemonId = link.id;
          evolution.pokemonName = link.pokemon_v2_pokemonspeciesnames[0].name;
          evolution.pokemonSprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${link.id}.png`;

          if(link.pokemon_v2_pokemonevolutions.length === 0) {
            evolutions.push(evolution);

            continue;
          }

          for(let evo of link.pokemon_v2_pokemonevolutions) {
            evolution.evolutionItemId = evo.evolution_item_id;
            evolution.evolutionItemName = evo.pokemon_v2_item?.pokemon_v2_itemnames[0].name;
            evolution.evolutionTriggerId = evo.evolution_trigger_id;
            evolution.evolutionTriggerName = evo.pokemon_v2_evolutiontrigger.pokemon_v2_evolutiontriggernames[0].name;
            evolution.evolvedSpeciesId = evo.evolved_species_id;
            evolution.genderId = evo.gender_id;
            evolution.heldItemId = evo.held_item_id;
            evolution.heldItemName = evo.pokemonV2ItemByHeldItemId?.pokemon_v2_itemnames[0].name;
            evolution.knownMoveId = evo.known_move_id;
            evolution.knownMoveTypeId = evo.known_move_type_id;
            evolution.knownMoveTypeName = evo.pokemon_v2_type?.pokemon_v2_typenames[0].name;
            evolution.locationId = evo.location_id;
            evolution.minAffection = evo.min_affection;
            evolution.minBeauty = evo.min_beauty;
            evolution.minHappiness = evo.min_happiness;
            evolution.minLevel = evo.min_level;
            evolution.needsOverworldRain = evo.needs_overworld_rain;
            evolution.partySpeciesId = evo.party_species_id;
            evolution.partyTypeId = evo.party_type_id;
            evolution.relativePhysicalStats = evo.relative_physical_stats;
            evolution.timeOfDay = evo.time_of_day;
            evolution.tradeSpeciesId = evo.trade_species_id;
            evolution.turnUpsideDown = evo.turn_upside_down;

            evolutions.push(evolution);
          }
        }

        const evos = _.uniq(evolutions)
        this.storage.addEvolutions(chainId, evos);

        return evos;
      }),
      catchError(() => {
        const list = this.storage.getEvolutions(chainId);
        let res: PokemonEvolution[] = [];

        if(list) {
          res = list;
        }

        return new Observable<PokemonEvolution[]>(o => {
          o.next(res);
          o.complete();
        });
      })
    );
  }
}
