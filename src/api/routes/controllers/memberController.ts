import { Cache } from "../../caches";
import { APIResponse } from "../../models";
import { ID } from "../../models/queries/id";
import { Member } from "../../models/responses";
import { Get } from "../models/methodType";

export namespace MemberController {
    export class Index implements Get {
        path: string;

        constructor() {
            this.path = "member";
        }

        execute(parameter: object): APIResponse {
            const cached = Cache.getOrMake<Member>(Member);
            const query = new ID(parameter);
            try {
                const member = cached.find((member) => member.id?.toString() == query.id)
                return APIResponse.Success(member);
            } catch (e) {
                return APIResponse.Failed("id was not specified")
            }
        }
    }
}