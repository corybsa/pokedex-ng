import { Injectable } from "@angular/core";
import { PokemonLocation } from "../location/pokemon-location.model";
import { Cache } from "./cache";
import * as _ from 'underscore';

@Injectable({ providedIn: 'root' })
export class LocationCache extends Cache {
    getPokemonLocations(pokemonId: number): PokemonLocation[] | null {
        this.checkExpireTime();

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
}