import * as moment from "moment";
import { PokemonListItem } from "./pokemon-list-item.model";

export class Storage {
    static Keys = {
        pokemonList: 'pokemon',
        expireTime: 'expire'
    };

    private static pokemonList: PokemonListItem[];
    private static wasUpdated = false;

    static getPokemon(): PokemonListItem[] {
        if(!this.pokemonList || this.wasUpdated) {
            console.log('accessing localStorage');
            this.pokemonList = JSON.parse(localStorage.getItem(this.Keys.pokemonList) as string) as PokemonListItem[];
            this.wasUpdated = false;
        }
        
        return this.pokemonList;
    }

    static addPokemon(pokemon: PokemonListItem): void {
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

    static updatePokemon(pokemon: PokemonListItem) {
        const index = this.pokemonList.findIndex(item => item.id === pokemon.id);
        this.pokemonList[index] = pokemon;
    }

    static savePokemon(): void {
        this.wasUpdated = true;
        localStorage.setItem(this.Keys.pokemonList, JSON.stringify(this.pokemonList));
    }

    static getExpireTime(): moment.Moment {
        return moment(localStorage.getItem(this.Keys.expireTime));
    }

    static setExpireTime(datetime: Date): void {
        localStorage.setItem(this.Keys.expireTime, datetime.toISOString());
    }
}