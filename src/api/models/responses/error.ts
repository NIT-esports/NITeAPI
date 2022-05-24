import { Response } from ".";

export class Error extends Response<Error> {
    message: string;

    constructor(message: string) {
        super({ message: message });
    }

    toJSON(): object {
        return {
            message: this.message
        };
    }
} 