import { Injectable } from "@angular/core";
import { PokemonMove } from "../pokemon/pokemon-move.model";
import { Cache } from "./cache";
import * as _ from 'underscore';

@Injectable({ providedIn: 'root' })
export class MoveCache extends Cache {
    private MoveKeys = {
        moves: 'moves'
    };

    constructor() {
        super();
    }

    getMoves(pokemonId: number): PokemonMove[] | null {
        this.checkExpireTime();

        let moves: any[] = JSON.parse(localStorage.getItem(this.MoveKeys.moves) as string);

        if(!moves) {
            return null;
        }

        const list = _.findWhere(moves, { pokemonId });

        return list ? list.moves : null;
    }

    addMoves(pokemonId: number, moves: PokemonMove[]) {
        let list = JSON.parse(localStorage.getItem(this.MoveKeys.moves) as string);

        if(!list) {
            list = [];
        }

        list.push({ pokemonId, moves });

        localStorage.setItem(this.MoveKeys.moves, JSON.stringify(list));
    }

    deleteData() {
        localStorage.removeItem(this.MoveKeys.moves);
    }
}
