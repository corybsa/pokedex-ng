import { NamedApiResource } from "./named-api-resource.model";

export interface NamedApiResourceList {
    count: number;
    next: string;
    previous: string;
    results: NamedApiResource[];
}
