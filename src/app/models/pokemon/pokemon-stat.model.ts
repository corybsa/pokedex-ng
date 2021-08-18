import { NamedApiResource } from "../common/named-api-resource.model";

export interface PokemonStat {
    stat: NamedApiResource;
    effort: number;
    base_stat: number;
}
