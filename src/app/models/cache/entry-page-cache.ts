import { Injectable } from "@angular/core";
import { Cache } from "./cache";

@Injectable({ providedIn: 'root' })
export class EntryPageCache extends Cache {
    constructor() {
        super();
    }

    getEntryPage(): number {
        const page = localStorage.getItem(this.Keys.entryPage);

        return page ? +page : 0;
    }

    setEntryPage(page: number) {
        localStorage.setItem(this.Keys.entryPage, page.toString());
    }
}
