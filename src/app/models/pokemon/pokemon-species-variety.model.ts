import { NamedApiResource } from "../common/named-api-resource.model";

export interface PokemonSpeciesVariety {
    is_default: boolean;
    pokemon: NamedApiResource;
}
