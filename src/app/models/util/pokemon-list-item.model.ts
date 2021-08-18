import { PokemonType } from "../pokemon/pokemon-type.model";

export interface PokemonListItem {
    id: number;
    name: string;
    types: PokemonType[];
}
