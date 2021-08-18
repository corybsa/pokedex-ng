import { NamedApiResource } from "../common/named-api-resource.model";

export interface PokemonAbility {
    is_hidden: boolean;
    slot: number;
    ability: NamedApiResource;
}
