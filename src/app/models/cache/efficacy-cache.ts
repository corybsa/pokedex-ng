import { Injectable } from "@angular/core";
import { PokemonTypeEfficacies } from "../pokemon/pokemon-type-efficacies.model";
import { Cache } from "./cache";

@Injectable({ providedIn: 'root' })
export class EfficacyCache extends Cache {
    private EfficacyKeys = {
        efficacies: 'efficacies'
    };

    constructor() {
        super();
    }

    getEfficacies(pokemonId: number): PokemonTypeEfficacies | null {
        this.checkExpireTime();

        let types: PokemonTypeEfficacies[] = JSON.parse(localStorage.getItem(this.EfficacyKeys.efficacies) as string);

        if(!types) {
            return null;
        }

        const type = types.find(item => item.pokemonId === pokemonId);

        return type || null;
    }

    addEfficacies(type: PokemonTypeEfficacies) {
        let types = JSON.parse(localStorage.getItem(this.EfficacyKeys.efficacies) as string);

        if(!types) {
            types = [];
        }

        types.push(type);
        localStorage.setItem(this.EfficacyKeys.efficacies, JSON.stringify(types));
    }

    deleteData() {
        localStorage.removeItem(this.EfficacyKeys.efficacies);
    }
}
