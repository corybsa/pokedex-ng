import { Injectable } from "@angular/core";
import { Generation } from "../util/generation.model";
import { Cache } from "./cache";

@Injectable({ providedIn: 'root' })
export class GenerationCache extends Cache {
    private generationId: number;

    constructor() {
        super();

        this.generationId = this.getGenerationId();
    }

    getGenerationId(): number {
        if(!this.generationId) {
            const item = localStorage.getItem(this.Keys.generationId);

            if(item) {
                this.generationId = +item;
            } else {
                this.generationId = 7; // gen 7
                localStorage.setItem(this.Keys.generationId, '7');
            }
        }

        return this.generationId;
    }

    setGenerationId(num: number) {
        this.generationId = num;

        this.deleteData();

        localStorage.setItem(this.Keys.generationId, num.toString());
    }

    getGenerations(): Generation[] | null {
        this.checkExpireTime();

        const generations = JSON.parse(localStorage.getItem(this.Keys.generations) as string);

        if(!generations) {
            return null;
        }

        return generations;
    }

    setGenerations(generations: Generation[]) {
        localStorage.setItem(this.Keys.generations, JSON.stringify(generations));
    }
}
