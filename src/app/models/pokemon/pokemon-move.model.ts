import { NamedApiResource } from "../common/named-api-resource.model";
import { PokemonMoveVersion } from "./pokemon-move-version.model";

export interface PokemonMove {
    move: NamedApiResource;
    version_group_details: PokemonMoveVersion[];
}
