import { Injectable } from "@angular/core";
import { Pokemon } from "../pokemon/pokemon.model";
import { Cache } from "./cache";

@Injectable({ providedIn: 'root' })
export class PokemonCache extends Cache {
    constructor() {
        super();
    }

    getPokemon(id: number): Pokemon | undefined {
        this.checkExpireTime();
        const pokemon: any[] = JSON.parse(localStorage.getItem(this.Keys.pokemon) as string);
        return pokemon?.find(item => item.id === id);
    }

    addPokemon(pokemon: Pokemon) {
        let p = JSON.parse(localStorage.getItem(this.Keys.pokemon) as string);

        if(!p) {
            p = [];
        }

        p.push(pokemon);
        localStorage.setItem(this.Keys.pokemon, JSON.stringify(p));
    }
}
