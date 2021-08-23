import * as moment from "moment";
import { Type } from "../pokemon/type.model";
import { PokemonListItem } from "./pokemon-list-item.model";

export class Storage {
    static Keys = {
        expireTime: 'expire',
        pokemonList: 'pokemon',
        types: 'types'
    };

    private static pokemonList: PokemonListItem[];
    private static wasUpdated = false;

    static getPokemonList(): PokemonListItem[] {
        if(!this.pokemonList || this.wasUpdated) {
            this.pokemonList = JSON.parse(localStorage.getItem(this.Keys.pokemonList) as string) as PokemonListItem[];
            this.wasUpdated = false;
        }
        
        return this.pokemonList;
    }

    static addPokemonToList(pokemon: PokemonListItem): void {
        if(!this.pokemonList) {
            this.pokemonList = [];
        }

        const index = this.pokemonList.findIndex(item => item.id === pokemon.id);

        // pokemon already in list
        if(index > -1) {
            return;
        }

        this.pokemonList.push(pokemon);
    }

    static updatePokemonList(pokemon: PokemonListItem) {
        const index = this.pokemonList.findIndex(item => item.id === pokemon.id);
        this.pokemonList[index] = pokemon;
    }

    static savePokemonList(): void {
        this.wasUpdated = true;
        localStorage.setItem(this.Keys.pokemonList, JSON.stringify(this.pokemonList));
    }

    static getExpireTime(): moment.Moment {
        return moment(localStorage.getItem(this.Keys.expireTime));
    }

    static setExpireTime(datetime: Date): void {
        localStorage.setItem(this.Keys.expireTime, datetime.toISOString());
    }

    static getType(id: number) {
        const types: Type[] = JSON.parse(localStorage.getItem(this.Keys.types) as string);
        return types?.find(item => item.id === id);
    }

    static setType(type: Type) {
        let types = JSON.parse(localStorage.getItem(this.Keys.types) as string);

        if(!types) {
            types = [];
        }

        types.push(type);

        localStorage.setItem(this.Keys.types, JSON.stringify(types));
    }
}