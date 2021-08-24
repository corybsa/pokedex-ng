import { NamedApiResource } from "./named-api-resource.model";

export interface FalvorText {
    flavor_text: string;
    language: NamedApiResource;
    version: NamedApiResource;
}
