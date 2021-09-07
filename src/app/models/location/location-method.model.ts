import { PokemonLocationCondition } from "./location-condition.model";

export interface PokemonLocationMethod {
    id: number;
    name: string;
    minLevel: number;
    maxLevel: number;
    conditions: PokemonLocationCondition[];
}
