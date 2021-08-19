import { GenerationGameIndex } from "../common/generation-game-index.model";
import { Name } from "../common/name.model";
import { NamedApiResource } from "../common/named-api-resource.model";
import { TypePokemon } from "./type-pokemon.model";
import { TypeRelations } from "./type-relations.model";

export interface Type {
    id: number;
    name: string;
    damage_relations: TypeRelations;
    game_indices: GenerationGameIndex[];
    generation: NamedApiResource;
    move_damage_class: NamedApiResource;
    names: Name[];
    pokemon: TypePokemon[];
    moves: NamedApiResource[];
}
