import { PokemonLocationVersion } from "./location-version.model";

export interface PokemonLocation {
    locationAreaId: number;
    locationAreaName: string;
    locationName: string;
    versions: PokemonLocationVersion[];
}
