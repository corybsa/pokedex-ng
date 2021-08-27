import { PokemonType } from "./pokemon-type.model";

export interface PokemonListItem {
    id: number;
    name: string;
    localeName: string;
    types: PokemonType[];
}