import { Injectable } from "@angular/core";
import { Cache } from "./cache";

@Injectable({ providedIn: 'root' })
export class EntryPageCache extends Cache {
    private EntryPageKeys = {
        entryPage: 'entryPage'
    };

    constructor() {
        super();
    }

    getEntryPage(): number {
        const page = localStorage.getItem(this.EntryPageKeys.entryPage);

        return page ? +page : 0;
    }

    setEntryPage(page: number) {
        localStorage.setItem(this.EntryPageKeys.entryPage, page.toString());
    }

    deleteData() {
        localStorage.removeItem(this.EntryPageKeys.entryPage);
    }
}
