import { ApiResource } from "../common/api-resource.model";
import { Description } from "../common/description.model";
import { FalvorText } from "../common/flavor-text.model";
import { Name } from "../common/name.model";
import { NamedApiResource } from "../common/named-api-resource.model";
import { Genus } from "./genus.model";
import { PalParkEncounterArea } from "./pal-park-encounter-area.model";
import { PokemonSpeciesDexEntry } from "./pokemon-species-dex-entry.model";
import { PokemonSpeciesVariety } from "./pokemon-species-variety.model";

export interface PokemonSpecies {
    id: number;
    name: string;
    order: number;
    gender_rate: number;
    capture_rate: number;
    base_happiness: number;
    is_baby: boolean;
    is_legendary: boolean;
    is_mythical: boolean;
    hatch_counter: number;
    has_gender_differences: boolean;
    forms_switchable: boolean;
    growth_rate: NamedApiResource;
    pokedex_numbers: PokemonSpeciesDexEntry[];
    egg_groups: NamedApiResource[];
    color: NamedApiResource;
    shape: NamedApiResource;
    evolves_from_species: NamedApiResource;
    evolution_chain: ApiResource;
    habitat: NamedApiResource;
    generation: NamedApiResource;
    names: Name[];
    pal_park_encounterse: PalParkEncounterArea;
    flavor_text_entries: FalvorText[];
    form_descriptions: Description[];
    genera: Genus[];
    varieties: PokemonSpeciesVariety[];
}
