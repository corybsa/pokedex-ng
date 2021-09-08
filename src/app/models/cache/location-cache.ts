import { Injectable } from "@angular/core";
import { PokemonLocation } from "../location/pokemon-location.model";
import { Cache } from "./cache";
import * as _ from 'underscore';
import { LocationEncounter } from "../location/location-encounter.model";
import { Region } from "../location/region.model";

@Injectable({ providedIn: 'root' })
export class LocationCache extends Cache {
    getPokemonLocations(pokemonId: number): PokemonLocation[] | null {
        let locations: any[] = JSON.parse(localStorage.getItem(this.Keys.pokemonLocations) as string);

        if(!locations) {
            return null;
        }

        const list = _.findWhere(locations, { pokemonId });
        return list ? list.locations : null;
    }

    addPokemonLocations(pokemonId: number, locations: PokemonLocation[]) {
        let list = JSON.parse(localStorage.getItem(this.Keys.pokemonLocations) as string);

        if(!list) {
            list = [];
        }

        list.push({ pokemonId, locations });

        localStorage.setItem(this.Keys.pokemonLocations, JSON.stringify(list));
    }

    getLocationEncounters(locationId: number): LocationEncounter[] | null {
        let encounters: any[] = JSON.parse(localStorage.getItem(this.Keys.locationEncounters) as string);

        if(!encounters) {
            return null;
        }

        const list = _.findWhere(encounters, { locationId });
        return list ? list.encounters : null;
    }

    addLocationEncounters(locationId: number, encounters: LocationEncounter[]) {
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