export class Discord {
    readonly id: string;
    readonly nickname: string;

    constructor(id: string, nickname: string) {
        this.id = id;
        this.nickname = nickname;
    }
}