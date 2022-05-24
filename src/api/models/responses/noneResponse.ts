import { Response } from ".";

export class NoneResponse extends Response<NoneResponse> {
    constructor() {
        super({});
    }

    toJSON(): object {
        return {}
    }
}