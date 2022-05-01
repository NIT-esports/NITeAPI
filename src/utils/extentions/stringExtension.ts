export { }

declare global {
    interface String {
        insertAt(index: number, context: string): string;
    }
}

String.prototype.insertAt = function (index: number, context: string): string {
    return this.substr(0, index) + context + this.substr(index);
}