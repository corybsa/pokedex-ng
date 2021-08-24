import { NamedApiResource } from "../common/named-api-resource.model";
import { EvolutionDetail } from "./evolution-detail.model";

export interface ChainLink {
    is_baby: boolean;
    species: NamedApiResource;
    evolution_details: EvolutionDetail[];
    evolves_to: ChainLink[];
}
