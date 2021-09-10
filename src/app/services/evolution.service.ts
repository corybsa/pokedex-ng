import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EvolutionCache } from '../models/cache/evolution-cache';
import { LanguageCache } from '../models/cache/language-cache';
import { PokemonEvolution } from '../models/pokemon/pokemon-evolution.model';
import * as _ from 'underscore';

@Injectable({
  providedIn: 'root'
})
export class EvolutionService {

  constructor(
    private apollo: Apollo,
    private languageCache: LanguageCache,
    private evolutionCache: EvolutionCache
  ) { }

  getEvolutions(chainId: number): Observable<PokemonEvolution[]> {
    const list = this.evolutionCache.getEvolutions(chainId);

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
        languageId: this.languageCache.getLanguageId()
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
            evolution.evolutionTriggerName = evo.pokemon_v2_evolutiontrigger.pokemon_v2_evolutiontriggernames[0]?.name;
            evolution.evolvedSpeciesId = evo.evolved_species_id;
            evolution.genderId = evo.gender_id;
            evolution.heldItemId = evo.held_item_id;
            evolution.heldItemName = evo.pokemonV2ItemByHeldItemId?.pokemon_v2_itemnames[0]?.name;
            evolution.knownMoveId = evo.known_move_id;
            evolution.knownMoveTypeId = evo.known_move_type_id;
            evolution.knownMoveTypeName = evo.pokemon_v2_type?.pokemon_v2_typenames[0]?.name;
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
        this.evolutionCache.addEvolutions(chainId, evos);

        return evos;
      })
    );
  }
}
