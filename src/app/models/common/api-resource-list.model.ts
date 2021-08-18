import { ApiResource } from "./api-resource.model";

export interface ApiResourceList {
    count: number;
    next: string;
    previous: string;
    results: ApiResource[];
}
