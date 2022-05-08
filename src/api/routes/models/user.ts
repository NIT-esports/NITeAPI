import { Get } from "..";
import { Member } from "../../../models";
import { Cache } from "../../../utils/caches";
import { Result, ResultState } from "../../models";

export class User implements Get {
    path: string;

    constructor() {
        this.path = "user";
    }

    execute(query: { [key: string]: any; }): Result {
        const cached = Cache.getOrMake<Member>(Member);
        try {
            const member =  cached.find((member) => member.id.toString() == query.id)
            return new Result(ResultState.SUCCESS, "", member);
        } catch(e) {
            return new Result(ResultState.FAILED, "id was not specified", null)
        }
    }
}