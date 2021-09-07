import { PokemonLocationVersion } from "./location-version.model";

export interface PokemonLocation {
    locationAreaId: number;
    locationName: string;
    versions: PokemonLocationVersion[];
}
