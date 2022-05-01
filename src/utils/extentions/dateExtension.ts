export { }

declare global {
    interface Date {
        getDayToJapanese(): string;
    }
}

Date.prototype.getDayToJapanese = function (): string {
    const days = ["日", "月", "火", "水", "木", "金", "土"];
    const index: number = this.getDay();
    return days[index];
}