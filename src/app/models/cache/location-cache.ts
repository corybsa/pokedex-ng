import { Injectable } from "@angular/core";
import { Cache } from "./cache";
import * as _ from 'underscore';
import { Region } from "../location/region.model";
import { VersionLocationEncounter } from "../location/version-location-encounter.model";

@Injectable({ providedIn: 'root' })
export class LocationCache extends Cache {
    getPokemonLocations(pokemonId: number): VersionLocationEncounter[] | null {
        let locations: any[] = JSON.parse(localStorage.getItem(this.Keys.pokemonLocations) as string);

        if(!locations) {
            return null;
        }

        const list = _.findWhere(locations, { pokemonId });
        return list ? list.locations : null;
    }

    addPokemonLocations(pokemonId: number, locations: VersionLocationEncounter[]) {
        let list = JSON.parse(localStorage.getItem(this.Keys.pokemonLocations) as string);

        if(!list) {
            list = [];
        }

        list.push({ pokemonId, locations });

        localStorage.setItem(this.Keys.pokemonLocations, JSON.stringify(list));
    }

    getLocationEncounters(locationId: number): VersionLocationEncounter[] | null {
        let encounters: any[] = JSON.parse(localStorage.getItem(this.Keys.locationEncounters) as string);

        if(!encounters) {
            return null;
        }

        const list = _.findWhere(encounters, { locationId });
        return list ? list.encounters : null;
    }

    addLocationEncounters(locationId: number, encounters: VersionLocationEncounter[]) {
        let list = JSON.parse(localStorage.getItem(this.Keys.locationEncounters) as string);

        if(!list) {
            list = [];
        }

        list.push({ locationId, encounters });
        
        localStorage.setItem(this.Keys.locationEncounters, JSON.stringify(list));
    }

    getRegions(): Region[] | null {
        const regions = JSON.parse(localStorage.getItem(this.Keys.regions) as string);

        if(!regions) {
            return null;
        }

        return regions;
    }

    setRegions(regions: Region[]) {
        localStorage.setItem(this.Keys.regions, JSON.stringify(regions));
    }
}