import { PokemonType } from "./pokemon-type.model";

export interface PokemonMove {
    localeName: string;
    type: PokemonType;
    localeEffect: string;
    localeClass: string;
    levelLearned: number;
    power: number;
    powerPoints: number;
    accuracy: number;
}
