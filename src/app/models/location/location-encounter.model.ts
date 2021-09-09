import { PokemonLocationMethod } from "./location-method.model";

export interface LocationEncounter {
    locationAreaId: number;
    locationAreaName: string;
    locationName: string;
    pokemonId: number;
    pokemonName: string;
    methods: PokemonLocationMethod[];
}
