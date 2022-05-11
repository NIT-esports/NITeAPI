export abstract class Query<T> {
    constructor(partial: Partial<T>) {
        Object.assign(this, partial);
    }
}