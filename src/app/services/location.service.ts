import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GenerationCache } from '../models/cache/generation-cache';
import { LanguageCache } from '../models/cache/language-cache';
import { Location } from '../models/location/location.model';
import * as _ from 'underscore';
import { LocationCache } from '../models/cache/location-cache';
import { Region } from '../models/location/region.model';
import { VersionLocationEncounter } from '../models/location/version-location-encounter.model';

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

  getPokemonLocations(pokemonId: number): Observable<VersionLocationEncounter[]> {
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
            pokemon_v2_version {
              id
              pokemon_v2_versionnames(where: {language_id: {_eq: $languageId}}) {
                name
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
        const encounters = this.parseLocations(res);

        for(let encounter of encounters) {
          encounter.locations = _.sortBy(encounter.locations, 'locationName');
        }

        this.locationCache.addPokemonLocations(pokemonId, encounters);

        return encounters;
      })
    );
  }

  getLocationEncounters(locationId: number): Observable<VersionLocationEncounter[]> {
    const encounters = this.locationCache.getLocationEncounters(locationId);

    if(encounters) {
      return new Observable(o => {
        o.next(encounters);
        o.complete();
      });
    }

    return this.apollo.watchQuery({
      query: gql`
        query getLocationEncounters${environment.name}($locationId: Int!, $languageId: Int!) {
          pokemon_v2_encounter(where: {pokemon_v2_locationarea: {location_id: {_eq: $locationId}}}, order_by: {location_area_id: asc, pokemon_v2_version: {pokemon_v2_versiongroup: {generation_id: asc}}}) {
            min_level
            max_level
            pokemon_v2_version {
              id
              pokemon_v2_versionnames(where: {language_id: {_eq: $languageId}}) {
                name
              }
            }
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
        const encounters = this.parseLocations(res);

        for(let encounter of encounters) {
          encounter.locations = _.sortBy(encounter.locations, 'pokemonName');
        }

        this.locationCache.addLocationEncounters(locationId, encounters);

        return encounters;
      })
    );
  }

  parseLocations(res: any): VersionLocationEncounter[] {
    const data = res.data.pokemon_v2_encounter;
    const temp: any[] = [];
    const final: VersionLocationEncounter[] = [];

    for(let d of data) {
      temp.push({
        locationAreaId: d.pokemon_v2_locationarea.id,
        locationAreaName: d.pokemon_v2_locationarea.pokemon_v2_locationareanames[0]?.name,
        locationName: d.pokemon_v2_locationarea.pokemon_v2_location.pokemon_v2_locationnames[0]?.name,
        pokemonId: d.pokemon_v2_pokemon?.id,
        pokemonName: d.pokemon_v2_pokemon?.pokemon_v2_pokemonspecy.pokemon_v2_pokemonspeciesnames[0]?.name,
        versionId: d.pokemon_v2_version.id,
        versionName: d.pokemon_v2_version.pokemon_v2_versionnames[0]?.name,
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
      // check if this version is in array
      const version = final.find(item => item.versionId === t.versionId);

      if(version) {
        // check if the location is in array
        const location = version.locations.find(item => {
          if(t.pokemonId) {
            return item.locationAreaId === t.locationAreaId && item.pokemonId === t.pokemonId;
          }

          return item.locationAreaId === t.locationAreaId;
        });

        if(location) {
          // check if method is in array
          const method = location.methods.find(item => item.id === t.methodId);

          if(method) {
            method.minLevel = Math.min(method.minLevel, t.minLevel);
            method.maxLevel = Math.max(method.maxLevel, t.maxLevel);

            // check if condition is in array
            const condition = method.conditions.find(item => item.id === t.conditionId);

            if(condition) {
              condition.chance += t.chance;
            } else {
              method.conditions.push({
                id: t.conditionId,
                name: t.condition,
                chance: t.chance
              });
            }
          } else {
            location.methods.push({
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
          version.locations.push({
            locationAreaId: t.locationAreaId,
            locationAreaName: t.locationAreaName,
            locationName: t.locationName,
            pokemonId: t.pokemonId,
            pokemonName: t.pokemonName,
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
        final.push({
          versionId: t.versionId,
          versionName: t.versionName,
          locations: [{
            locationAreaId: t.locationAreaId,
            locationAreaName: t.locationAreaName,
            locationName: t.locationName,
            pokemonId: t.pokemonId,
            pokemonName: t.pokemonName,
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
        });
      }
    }

    return final;
  }
}
