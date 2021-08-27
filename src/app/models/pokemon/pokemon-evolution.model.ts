export interface PokemonEvolution {
    pokemonId: number;
    pokemonName: string;
    pokemonSprite: string;
    evolutionItemId: number;
    evolutionItemName: string;
    evolutionTriggerId: number;
    evolutionTriggerName: string;
    evolvedSpeciesId: number;
    genderId: number;
    heldItemId: number;
    heldItemName: string;
    knownMoveId: number;
    knownMoveTypeId: number;
    knownMoveTypeName: string;
    locationId: number;
    minAffection: number;
    minBeauty: number;
    minHappiness: number;
    minLevel: number;
    needsOverworldRain: boolean;
    partySpeciesId: number;
    partyTypeId: number;
    relativePhysicalStats: number;
    timeOfDay: string;
    tradeSpeciesId: number;
    turnUpsideDown: boolean;
}
