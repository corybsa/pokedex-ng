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
import { Region } from '../models/location/region.model';
import { LocationEncounter } from '../models/location/location-encounter.model';

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

  getRegions(): Observable<Region[]> {
    const regions = this.locationCache.getRegions();

    if(regions) {
      return new Observable(o => {
        o.next(regions);
        o.complete();
      });
    }

    return this.apollo.watchQuery({
      query: gql`
        query getLocations${environment.name}($languageId: Int!) {
          pokemon_v2_region {
            id
            pokemon_v2_regionnames(where: {language_id: {_eq: $languageId}}) {
              name
            }
            pokemon_v2_locations(order_by: {id: asc}) {
              id
              pokemon_v2_locationnames(where: {language_id: {_eq: $languageId}}) {
                name
              }
            }
          }
        }
      `,
      variables: {
        languageId: this.languageCache.getLanguageId()
      }
    }).valueChanges.pipe(
      map((res: any) => {
        const data = res.data.pokemon_v2_region;
        const regions: Region[] = [];

        for(let region of data) {
          const locations: Location[] = [];

          for(let location of region.pokemon_v2_locations) {
            locations.push({
              id: location.id,
              name: location.pokemon_v2_locationnames[0]?.name
            });
          }

          regions.push({
            id: region.id,
            name: region.pokemon_v2_regionnames[0]?.name,
            locations: _.sortBy(locations, 'name')
          });
        }

        this.locationCache.setRegions(regions);

        return regions;
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
              pokemon_v2_locationareanames(where: {language_id: {_eq: $languageId}}) {
                name
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
        const locations = this.parseLocations<PokemonLocation>(res);
        this.locationCache.addPokemonLocations(pokemonId, locations);

        return locations;
      })
    );
  }

  getLocationEncounters(locationId: number): Observable<LocationEncounter[]> {
    const encounters = this.locationCache.getLocationEncounters(locationId);

    if(encounters) {
      return new Observable(o => {
        o.next(encounters);
        o.complete();
      });
    }

    return this.apollo.watchQuery({
      query: gql`
        query getLocationEncounters($locationId: Int!, $languageId: Int!) {
          pokemon_v2_encounter(where: {pokemon_v2_locationarea: {location_id: {_eq: $locationId}}}, order_by: {location_area_id: asc, pokemon_v2_version: {pokemon_v2_versiongroup: {generation_id: asc}}}) {
            min_level
            max_level
            pokemon_v2_pokemon {
              id
              pokemon_v2_pokemonspecy {
                pokemon_v2_pokemonspeciesnames(where: {language_id: {_eq: $languageId}}) {
                  name
                }
              }
            }
            pokemon_v2_locationarea {
              id
              pokemon_v2_location {
                pokemon_v2_locationnames(where: {language_id: {_eq: $languageId}}) {
                  name
                }
              }
              pokemon_v2_locationareanames(where: {language_id: {_eq: $languageId}}) {
                name
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
        locationId: locationId,
        languageId: this.languageCache.getLanguageId()
      }
    }).valueChanges.pipe(
      map((res: any) => {
        const encounters = _.sortBy(this.parseLocations<LocationEncounter>(res), 'pokemonName');
        this.locationCache.addLocationEncounters(locationId, encounters);

        return encounters;
      })
    );
  }

  parseLocations<T extends PokemonLocation | LocationEncounter>(res: any): T[] {
    const data = res.data.pokemon_v2_encounter;
    const temp: any[] = [];
    const final: T[] = [];

    for(let d of data) {
      temp.push({
        locationAreaId: d.pokemon_v2_locationarea.id,
        locationAreaName: d.pokemon_v2_locationarea.pokemon_v2_locationareanames[0]?.name,
        locationName: d.pokemon_v2_locationarea.pokemon_v2_location.pokemon_v2_locationnames[0]?.name,
        pokemonId: d.pokemon_v2_pokemon?.id,
        pokemonName: d.pokemon_v2_pokemon?.pokemon_v2_pokemonspecy.pokemon_v2_pokemonspeciesnames[0]?.name,
        versionId: d.pokemon_v2_encounterslot.version_group_id,
        versionName: _.map(d.pokemon_v2_encounterslot.pokemon_v2_versiongroup.pokemon_v2_versions, item => item.pokemon_v2_versionnames[0].name).join('/'),
        minLevel: d.min_level,
        maxLevel: d.max_level,
        conditionId: d.pokemon_v2_encounterconditionvaluemaps[0]?.pokemon_v2_encounterconditionvalue.pokemon_v2_encounterconditionvaluenames[0].encounter_condition_value_id,
        condition: d.pokemon_v2_encounterconditionvaluemaps[0]?.pokemon_v2_encounterconditionvalue.pokemon_v2_encounterconditionvaluenames[0].name,
        chance: d.pokemon_v2_encounterslot.rarity,
        methodId: d.pokemon_v2_encounterslot.pokemon_v2_encountermethod.id,
        methodName: d.pokemon_v2_encounterslot.pokemon_v2_encountermethod.pokemon_v2_encountermethodnames[0]?.name
      });
    }

    for(let t of temp) {
      // check if this location is in the locations array
      const location = final.find((item: any) => {
        if('pokemonId' in t) {
          return item.locationAreaId === t.locationAreaId && item.pokemonId === t.pokemonId;
        }

        return item.locationAreaId === t.locationAreaId;
      });

      if(location) {
        const version = location.versions.find((item: any) => item.id === t.versionId);

        if(version) {
          // check if the method is in the methods array
          const method = version.methods.find((item: any) => item.id === t.methodId);

          if(method) {
            method.minLevel = Math.min(method.minLevel, t.minLevel);
            method.maxLevel = Math.max(method.maxLevel, t.maxLevel);

            // check if the condition is in the conditions array
            const condition = method.conditions.find((item: any) => item.id === t.conditionId);

            if(condition) {
              condition.chance += t.chance;
            } else {
              // condition was not in the conditions array
              method.conditions.push({
                id: t.conditionId,
                name: t.condition,
                chance: t.chance
              });
            }
          } else {
            // method was not in the methods array
            version.methods.push({
              id: t.methodId,
              name: t.methodName,
              minLevel: t.minLevel,
              maxLevel: t.maxLevel,
              conditions: [{
                id: t.conditionId,
                name: t.condition,
                chance: t.chance
              }]
            });
          }
        } else {
          // version was not in the versions array
          location.versions.push({
            id: t.versionId,
            name: t.versionName,
            methods: [{
              id: t.methodId,
              name: t.methodName,
              minLevel: t.minLevel,
              maxLevel: t.maxLevel,
              conditions: [{
                id: t.conditionId,
                name: t.condition,
                chance: t.chance
              }]
            }]
          });
        }
      } else {
        // location was not in the locations array
        const i = {
          locationAreaId: t.locationAreaId,
          locationAreaName: t.locationAreaName,
          locationName: t.locationName,
          versions: [{
            id: t.versionId,
            name: t.versionName,
            methods: [{
              id: t.methodId,
              name: t.methodName,
              minLevel: t.minLevel,
              maxLevel: t.maxLevel,
              conditions: [{
                id: t.conditionId,
                name: t.condition,
                chance: t.chance
              }]
            }]
          }]
        };

        if('pokemonId' in t) {
          (<LocationEncounter>i).pokemonId = t.pokemonId;
          (<LocationEncounter>i).pokemonName = t.pokemonName;
        }

        final.push(i as T);
      }
    }

    return final;
  }
}
