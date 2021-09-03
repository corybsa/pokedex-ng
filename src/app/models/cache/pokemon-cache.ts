import { Injectable } from "@angular/core";
import { Pokemon } from "../pokemon/pokemon.model";
import { Cache } from "./cache";

@Injectable({ providedIn: 'root' })
export class PokemonCache extends Cache {
    private PokemonKeys = {
        pokemon: 'pokemon'
    };

    constructor() {
        super();
    }

    getPokemon(id: number): Pokemon | undefined {
        this.checkExpireTime();
        const pokemon: any[] = JSON.parse(localStorage.getItem(this.PokemonKeys.pokemon) as string);
        return pokemon?.find(item => item.id === id);
    }

    addPokemon(pokemon: Pokemon) {
        let p = JSON.parse(localStorage.getItem(this.PokemonKeys.pokemon) as string);

        if(!p) {
            p = [];
        }

        p.push(pokemon);
        localStorage.setItem(this.PokemonKeys.pokemon, JSON.stringify(p));
    }

    deleteData() {
        localStorage.removeItem(this.PokemonKeys.pokemon);
    }
}
