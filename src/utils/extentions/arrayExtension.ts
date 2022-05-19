export { }

declare global {
    interface Array<T> {
        distinct(): T[];
        transpose(): T[];
    }
}

Array.prototype.distinct = function () {
    return Array.from(new Set(this));
}

Array.prototype.transpose = function() {
    if(Array.isArray(this[0])) {
        return Object.keys(this[0]).map((c) => {
            return this.map((r) => {
                return r[c];
            });
        });
    } else {
        return undefined;
    }
}