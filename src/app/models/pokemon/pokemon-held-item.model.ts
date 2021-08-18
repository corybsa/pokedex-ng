import { NamedApiResource } from "../common/named-api-resource.model";
import { PokemonHeldItemVersion } from "./pokemon-held-item-version.model";

export interface PokemonHeldItem {
    item: NamedApiResource;
    version_details: PokemonHeldItemVersion[];
}
