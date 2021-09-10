import { PokemonMove } from "./pokemon-move.model";

export interface PokemonVersionMove {
    versionId: number;
    versionName: string;
    moves: PokemonMove[];
}