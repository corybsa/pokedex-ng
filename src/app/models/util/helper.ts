export class Helper {
    /**
     * Creates a deep copy of <code>object</code>.
     *
     * @param object T
     * @returns {any} a copy of <code>object</code>.
     */
    static copy(object: any): any {
        if (object instanceof Date) {
            return new Date(object.getTime());
        } else if (object instanceof Array) {
            const target = [];

            for (const obj of object) {
                target.push(Helper.copy(obj));
            }

            return target;
        } else if (object instanceof Object) {
            const target: any = {};

            for (const prop in object) {
                if (object.hasOwnProperty(prop)) {
                    target[prop] = Helper.copy(object[prop]);
                }
            }

            return target;
        } else {
            // it's a primitive
            return object;
        }
    }

    static getIdFromUrl(url: string): number {
        return +url?.replace(/v2|\D/gi, '');
    }
}
