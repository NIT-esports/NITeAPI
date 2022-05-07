import { Get } from "..";
import { MembersList } from "../../../controllers";
import { Result, ResultState } from "../../../models";

export class User implements Get {
    path: string;

    constructor() {
        this.path = "user";
    }

    execute(query: { [key: string]: any; }): Result {
        const list = new MembersList();
        try {
            const member =  list.findByID(query.id);
            return new Result(ResultState.SUCCESS, "", member);
        } catch(e) {
            return new Result(ResultState.FAILED, "id was not specified", null)
        }
    }
}