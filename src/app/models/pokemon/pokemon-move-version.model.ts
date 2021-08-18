import { NamedApiResource } from "../common/named-api-resource.model";

export interface PokemonMoveVersion {
    move_learn_method: NamedApiResource;
    version_group: NamedApiResource;
    level_learned_at: number;
}
