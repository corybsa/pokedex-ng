import { PokemonLocationMethod } from "./location-method.model";

export interface PokemonLocationVersion {
    id: number;
    name: string;
    methods: PokemonLocationMethod[];
}
