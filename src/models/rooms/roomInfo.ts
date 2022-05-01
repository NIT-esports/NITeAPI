export class RoomInfo {
    readonly name: string;
    readonly campus: string;

    constructor(name: string, campus: string) {
        this.name = name;
        this.campus = campus;
    }
}