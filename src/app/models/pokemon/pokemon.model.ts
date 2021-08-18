import { NamedApiResource } from "../common/named-api-resource.model";
import { VersionGameIndex } from "../common/version-game-index.model";
import { PokemonAbility } from "./pokemon-ability.model";
import { PokemonHeldItem } from "./pokemon-held-item.model";
import { PokemonMove } from "./pokemon-move.model";
import { PokemonSprites } from "./pokemon-sprites.model";
import { PokemonStat } from "./pokemon-stat.model";
import { PokemonType } from "./pokemon-type.model";

export interface Pokemon {
    id: number;
    name: string;
    base_experience: number;
    height: number;
    is_default: boolean;
    order: number;
    weight: number;
    abilities: PokemonAbility[];
    forms: NamedApiResource[];
    game_indices: VersionGameIndex[];
    help_items: PokemonHeldItem[];
    location_area_encounters: string;
    moves: PokemonMove[];
    sprites: PokemonSprites;
    species: NamedApiResource;
    stats: PokemonStat[];
    types: PokemonType[];
}
