import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GenerationCache } from '../models/cache/generation-cache';
import { LanguageCache } from '../models/cache/language-cache';
import { Location } from '../models/location/location.model';
import { PokemonLocation } from '../models/location/pokemon-location.model';
import * as _ from 'underscore';
import { LocationCache } from '../models/cache/location-cache';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(
    private apollo: Apollo,
    private generationCache: GenerationCache,
    private languageCache: LanguageCache,
    private locationCache: LocationCache
  ) { }

  getLocations(): Observable<Location[]> {
    return this.apollo.watchQuery({
      query: gql`
        query getLocations${environment.name}($languageId: Int!, $generationId: Int!) {
          pokemon_v2_region(where: {pokemon_v2_generations: {id: {_eq: $generationId}}}) {
            pokemon_v2_locations(order_by: {id: asc}) {
              pokemon_v2_locationnames(where: {language_id: {_eq: $languageId}}) {
                id
                name
              }
            }
          }
        }
      `,
      variables: {
        languageId: this.languageCache.getLanguageId(),
        generationId: this.generationCache.getGenerationId()
      }
    }).valueChanges.pipe(
      map((res: any) => {
        const data = res.data.pokemon_v2_region[0].pokemon_v2_locations;
        const locations: Location[] = [];

        for(let location of data) {
          locations.push({
            id: location.pokemon_v2_locationnames[0]?.id,
            name: location.pokemon_v2_locationnames[0]?.name
          });
        }

        return locations;
      })
    );
  }

  getPokemonLocations(pokemonId: number): Observable<PokemonLocation[]> {
    const locations = this.locationCache.getPokemonLocations(pokemonId);

    if(locations) {
      return new Observable(o => {
        o.next(locations);
        o.complete();
      });
    }

    return this.apollo.watchQuery({
      query: gql`
        query getPokemonLocations${environment.name}($pokemonId: Int!, $generationId: Int!, $languageId: Int!) {
          pokemon_v2_encounter(where: {pokemon_id: {_eq: $pokemonId}, pokemon_v2_version: {pokemon_v2_versiongroup: {generation_id: {_eq: $generationId}}}}, order_by: {location_area_id: asc}) {
            min_level
            max_level
            pokemon_v2_locationarea {
              id
              pokemon_v2_location {
                pokemon_v2_locationnames(where: {language_id: {_eq: $languageId}}) {
                  name
                }
              }
            }
            pokemon_v2_encounterslot {
              rarity
              version_group_id
              pokemon_v2_versiongroup {
                pokemon_v2_versions {
                  pokemon_v2_versionnames(where: {language_id: {_eq: $languageId}}) {
                    name
                  }
                }
              }
              pokemon_v2_encountermethod {
                id
                pokemon_v2_encountermethodnames(where: {language_id: {_eq: $languageId}}) {
                  name
                }
              }
            }
            pokemon_v2_encounterconditionvaluemaps {
              pokemon_v2_encounterconditionvalue {
                pokemon_v2_encounterconditionvaluenames(where: {language_id: {_eq: $languageId}}) {
                  encounter_condition_value_id
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
        languageId: this.languageCache.getLanguageId()
      }
    }).valueChanges.pipe(
      map((res: any) => {
        const data = res.data.pokemon_v2_encounter;
        const temp: any[] = [];
        const locations: PokemonLocation[] = [];

        for(let location of data) {
          temp.push({
            locationAreaId: location.pokemon_v2_locationarea.id,
            locationName: location.pokemon_v2_locationarea.pokemon_v2_location.pokemon_v2_locationnames[0]?.name,
            versionId: location.pokemon_v2_encounterslot.version_group_id,
            versionName: _.map(location.pokemon_v2_encounterslot.pokemon_v2_versiongroup.pokemon_v2_versions, item => item.pokemon_v2_versionnames[0].name).join('/'),
            minLevel: location.min_level,
            maxLevel: location.max_level,
            conditionId: location.pokemon_v2_encounterconditionvaluemaps[0]?.pokemon_v2_encounterconditionvalue.pokemon_v2_encounterconditionvaluenames[0].encounter_condition_value_id,
            condition: location.pokemon_v2_encounterconditionvaluemaps[0]?.pokemon_v2_encounterconditionvalue.pokemon_v2_encounterconditionvaluenames[0].name,
            chance: location.pokemon_v2_encounterslot.rarity,
            methodId: location.pokemon_v2_encounterslot.pokemon_v2_encountermethod.id,
            methodName: location.pokemon_v2_encounterslot.pokemon_v2_encountermethod.pokemon_v2_encountermethodnames[0]?.name
          });
        }

        // TODO: create data model
        // TODO: combine items that have the same locationAreaId, methodId, and conditionId
        // TODO: cache final results

        for(let loc of temp) {
          // check if this location is in the locations array
          const location = locations.find(item => item.locationAreaId === loc.locationAreaId);

          if(location) {
            const version = location.versions.find(item => item.id === loc.versionId);

            if(version) {
              // check if the method is in the methods array
              const method = version.methods.find(item => item.id === loc.methodId);

              if(method) {
                method.minLevel = Math.min(method.minLevel, loc.minLevel);
                method.maxLevel = Math.max(method.maxLevel, loc.maxLevel);

                // check if the condition is in the conditions array
                const condition = method.conditions.find(item => item.id === loc.conditionId);

                if(condition) {
                  condition.chance += loc.chance;
                } else {
                  // condition was not in the conditions array
                  method.conditions.push({
                    id: loc.conditionId,
                    name: loc.condition,
                    chance: loc.chance
                  });
                }
              } else {
                // method was not in the methods array
                version.methods.push({
                  id: loc.methodId,
                  name: loc.methodName,
                  minLevel: loc.minLevel,
                  maxLevel: loc.maxLevel,
                  conditions: [{
                    id: loc.conditionId,
                    name: loc.condition,
                    chance: loc.chance
                  }]
                });
              }
            } else {
              // version was not in the versions array
              location.versions.push({
                id: loc.versionId,
                name: loc.versionName,
                methods: [{
                  id: loc.methodId,
                  name: loc.methodName,
                  minLevel: loc.minLevel,
                  maxLevel: loc.maxLevel,
                  conditions: [{
                    id: loc.conditionId,
                    name: loc.condition,
                    chance: loc.chance
                  }]
                }]
              });
            }
          } else {
            // location was not in the locations array
            locations.push({
              locationAreaId: loc.locationAreaId,
              locationName: loc.locationName,
              versions: [{
                id: loc.versionId,
                name: loc.versionName,
                methods: [{
                  id: loc.methodId,
                  name: loc.methodName,
                  minLevel: loc.minLevel,
                  maxLevel: loc.maxLevel,
                  conditions: [{
                    id: loc.conditionId,
                    name: loc.condition,
                    chance: loc.chance
                  }]
                }]
              }]
            });
          }
        }

        this.locationCache.addPokemonLocations(pokemonId, locations);

        return locations;
      })
    );
  }
}
