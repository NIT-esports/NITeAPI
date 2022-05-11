export abstract class DTO<T> {
    constructor(partial: Partial<T>) {
        Object.assign(this, partial);
    }
}