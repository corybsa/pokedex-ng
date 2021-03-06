import { Injectable } from "@angular/core";
import { PokemonEvolution } from "../pokemon/pokemon-evolution.model";
import { Cache } from "./cache";
import * as _ from 'underscore';

@Injectable({ providedIn: 'root' })
export class EvolutionCache extends Cache {
    constructor() {
        super();
    }

    getEvolutions(chainId: number): PokemonEvolution[] | null {
        this.checkExpireTime();

        let evolutions: any[] = JSON.parse(localStorage.getItem(this.Keys.evolutions) as string);

        if(!evolutions) {
            return null;
        }

        const list = _.findWhere(evolutions, { chainId });

        return list ? list.evolutions : null;
    }

    addEvolutions(chainId: number, evolutions: PokemonEvolution[]) {
        let list = JSON.parse(localStorage.getItem(this.Keys.evolutions) as string);

        if(!list) {
            list = [];
        }

        list.push({ chainId, evolutions });

        localStorage.setItem(this.Keys.evolutions, JSON.stringify(list));
    }
}
