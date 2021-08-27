import { Injectable } from "@angular/core";
import * as moment from "moment";
import { PokemonListItem } from "../pokemon/pokemon-list-item.model";
import { PokemonTypeEfficacies } from "../pokemon/pokemon-type-efficacies.model";

@Injectable({ providedIn: 'root' })
export class Storage {
    private Keys = {
        expireTime: 'expire',
        languageId: 'languageId',
        pokemonList: 'pokemonList',
        pokemon: 'pokemon',
        efficacies: 'efficacies'
    };

    private languageId: number = 9;
    private pokemonList: PokemonListItem[] = [];

    constructor() {
        const expireDate = this.getExpireTime();

        // delete old data
        if(moment().isAfter(expireDate)) {
            this.deletePokemonList();
        }
    }

    getExpireTime(): moment.Moment {
        return moment(localStorage.getItem(this.Keys.expireTime));
    }

    setExpireTime(datetime: Date): void {
        localStorage.setItem(this.Keys.expireTime, datetime.toISOString());
    }

    getLanguageId(): number {
        if(!this.languageId) {
            const item = localStorage.getItem(this.Keys.languageId);
            // if item is null default to english
            this.languageId = item ? +item : 9;
        }

        return this.languageId;
    }

    setLanguageId(num: number) {
        this.languageId = num;
        localStorage.setItem(this.Keys.languageId, num.toString());
    }

    getPokemonList(): PokemonListItem[] {
        // to save accesses to localStorage
        if(this.pokemonList.length > 0) {
            return this.pokemonList;
        }

        this.pokemonList = JSON.parse(localStorage.getItem(this.Keys.pokemonList) as string) as PokemonListItem[];
        return this.pokemonList;
    }

    setPokemonList(list: PokemonListItem[]) {
        localStorage.setItem(this.Keys.pokemonList, JSON.stringify(list));
    }

    deletePokemonList() {
        localStorage.removeItem(this.Keys.pokemonList);
    }

    getPokemon(id: number): any | undefined {
        const pokemon: any[] = JSON.parse(localStorage.getItem(this.Keys.pokemon) as string);
        return pokemon?.find(item => item.id === id);
    }

    addPokemon(pokemon: any) {
        let p = JSON.parse(localStorage.getItem(this.Keys.pokemon) as string);

        if(!p) {
            p = [];
        }

        p.push(pokemon);
        localStorage.setItem(this.Keys.pokemon, JSON.stringify(p));
    }

    getEfficacies(pokemonId: number): PokemonTypeEfficacies | null {
        let types: PokemonTypeEfficacies[] = JSON.parse(localStorage.getItem(this.Keys.efficacies) as string);

        if(!types) {
            return null;
        }

        const type = types.find(item => item.pokemonId === pokemonId);

        if(!type) {
            return null;
        }

        return type;
    }

    addEfficacies(type: PokemonTypeEfficacies) {
        let types = JSON.parse(localStorage.getItem(this.Keys.efficacies) as string);

        if(!types) {
            types = [];
        }

        types.push(type);
        localStorage.setItem(this.Keys.efficacies, JSON.stringify(types));
    }
}