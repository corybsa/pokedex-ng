import * as moment from "moment";

export abstract class Cache {
    protected Keys = {
        expireTime: 'expire',
        efficacies: 'efficacies',
        entryPage: 'entryPage',
        evolutions: 'evolutions',
        generationId: 'generationid',
        generations: 'generations',
        languageId: 'languageId',
        languages: 'languages',
        moves: 'moves',
        pokemon: 'pokemon',
        pokemonList: 'pokemonList',
        pokemonLocations: 'pokemonLocations',
        locationEncounters: 'locationEncounters',
        regions: 'regions'
    };

    constructor() {
        this.checkExpireTime();
    }

    deleteData() {
        localStorage.removeItem(this.Keys.evolutions);
        localStorage.removeItem(this.Keys.efficacies);
        localStorage.removeItem(this.Keys.generations);
        localStorage.removeItem(this.Keys.moves);
        localStorage.removeItem(this.Keys.pokemon);
        localStorage.removeItem(this.Keys.pokemonList);
        localStorage.removeItem(this.Keys.pokemonLocations);
    }

    checkExpireTime() {
        const expireDate = this.getExpireTime();

        // delete old data
        if(moment().isAfter(expireDate)) {
            this.deleteData();
            this.setExpireTime(moment().add(1, 'week').toDate());
        }
    }

    getExpireTime(): moment.Moment {
        let time = moment(localStorage.getItem(this.Keys.expireTime));

        if(!time.isValid()) {
            time = moment().add(1, 'week');
        }

        return time;
    }

    setExpireTime(datetime: Date): void {
        localStorage.setItem(this.Keys.expireTime, datetime.toISOString());

        if(moment().isAfter(datetime)) {
            this.deleteData();
        }
    }
}