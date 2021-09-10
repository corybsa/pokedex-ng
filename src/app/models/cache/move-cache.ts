import { Injectable } from "@angular/core";
import { Cache } from "./cache";
import * as _ from 'underscore';
import { PokemonVersionMove } from "../pokemon/pokemon-version-move.model";

@Injectable({ providedIn: 'root' })
export class MoveCache extends Cache {
    constructor() {
        super();
    }

    getMoves(pokemonId: number): PokemonVersionMove[] | null {
        this.checkExpireTime();

        let moves: any[] = JSON.parse(localStorage.getItem(this.Keys.moves) as string);

        if(!moves) {
            return null;
        }

        const list = _.findWhere(moves, { pokemonId });

        return list ? list.moves : null;
    }

    addMoves(pokemonId: number, moves: PokemonVersionMove[]) {
        let list = JSON.parse(localStorage.getItem(this.Keys.moves) as string);

        if(!list) {
            list = [];
        }

        list.push({ pokemonId, moves });

        localStorage.setItem(this.Keys.moves, JSON.stringify(list));
    }
}
