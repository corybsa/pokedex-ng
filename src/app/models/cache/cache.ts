import * as moment from "moment";

export abstract class Cache {
    private Keys = {
        expireTime: 'expire'
    };

    constructor() {
        this.checkExpireTime();
    }

    abstract deleteData(): void;

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