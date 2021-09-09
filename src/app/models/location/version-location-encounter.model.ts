import { LocationEncounter } from "./location-encounter.model";

export interface VersionLocationEncounter {
    versionId: number;
    versionName: string;
    locations: LocationEncounter[];
}
