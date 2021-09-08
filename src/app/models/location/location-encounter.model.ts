import { PokemonLocationVersion } from "./location-version.model";

export interface LocationEncounter {
    locationAreaId: number;
    locationAreaName: string;
    locationName: string;
    pokemonId: number;
    pokemonName: string;
    versions: PokemonLocationVersion[];
}
