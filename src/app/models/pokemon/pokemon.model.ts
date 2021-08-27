import { PokemonType } from "./pokemon-type.model";

export interface Pokemon {
    id: number;
    name: string;
    localeName: string;
    height: number;
    weight: number;
    evolutionChainId: number;
    spriteUrl: string;
    types: PokemonType[];
}
