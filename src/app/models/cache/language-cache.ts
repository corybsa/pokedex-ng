import { Injectable } from "@angular/core";
import { Language } from "../util/language";
import { Cache } from "./cache";

@Injectable({ providedIn: 'root' })
export class LanguageCache extends Cache { 
    private languageId: number;

    constructor() {
        super();
        
        this.languageId = this.getLanguageId();
    }

    getLanguageId(): number {
        if(!this.languageId) {
            const item = localStorage.getItem(this.Keys.languageId);
            // if item is null default to english
            if(item) {
                this.languageId = +item;
            } else {
                this.languageId = 9; // english
                localStorage.setItem(this.Keys.languageId, '9');
            }
        }

        return this.languageId;
    }

    setLanguageId(num: number) {
        this.languageId = num;
        
        this.setExpireTime(new Date());
        this.deleteData();

        localStorage.setItem(this.Keys.languageId, num.toString());
    }

    getLanguages(): Language[] | null {
        const languages = JSON.parse(localStorage.getItem(this.Keys.languages) as string);

        if(!languages) {
            return null;
        }

        return languages;
    }

    setLanguages(languages: Language[]) {
        localStorage.setItem(this.Keys.languages, JSON.stringify(languages));
    }
}
