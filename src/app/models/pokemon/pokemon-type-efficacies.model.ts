import { PokemonType } from "./pokemon-type.model";

export interface PokemonTypeEfficacies {
    pokemonId: number;
    zeroDamage: PokemonType[];
    quarterDamage: PokemonType[];
    halfDamage: PokemonType[];
    normalDamage: PokemonType[];
    doubleDamage: PokemonType[];
    quadDamage: PokemonType[];
}
