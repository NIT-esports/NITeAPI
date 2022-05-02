export interface CacheableStatic<T extends new (...args) => Cacheable<T>> {
    fromObject(obj: object): Cacheable<T>;
}

export interface Cacheable<T extends new (...args) => any> {
    toJSON(): object;
    constructor: T;
}