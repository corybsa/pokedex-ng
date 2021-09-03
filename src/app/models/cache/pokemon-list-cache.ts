import { Injectable } from "@angular/core";
import { PokemonListItem } from "../pokemon/pokemon-list-item.model";
import { Cache } from "./cache";

@Injectable({ providedIn: 'root' })
export class PokemonListCache extends Cache {
    private ListKeys = {
        pokemonList: 'pokemonList'
    };

    private list: PokemonListItem[] = [];

    constructor() {
        super();
    }

    getList(): PokemonListItem[] {
        this.checkExpireTime();

        // to save accesses to localStorage
        if(this.list && this.list.length > 0) {
            return this.list;
        }

        this.list = JSON.parse(localStorage.getItem(this.ListKeys.pokemonList) as string) as PokemonListItem[];
        return this.list;
    }

    setList(list: PokemonListItem[]) {
        localStorage.setItem(this.ListKeys.pokemonList, JSON.stringify(list));
    }

    deleteData() {
        localStorage.removeItem(this.ListKeys.pokemonList);
    }
}
