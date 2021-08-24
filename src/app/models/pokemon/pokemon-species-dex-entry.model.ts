import { NamedApiResource } from "../common/named-api-resource.model";

export interface PokemonSpeciesDexEntry {
    entry_number: number;
    pokedex: NamedApiResource;
}
