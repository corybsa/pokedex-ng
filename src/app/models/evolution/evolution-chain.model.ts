import { NamedApiResource } from "../common/named-api-resource.model";
import { ChainLink } from "./chain-link.model";

export interface EvolutionChain {
    id: number;
    baby_trigger_item: NamedApiResource;
    chain: ChainLink;
}
