import { Cache } from "../../../utils/caches";
import { Response } from "../../models";
import { ID } from "../../models/queries/id";
import { Member } from "../../models/responses";
import { Get } from "../models/methodType";

export namespace MemberController {
    export class Index implements Get {
        path: string;

        constructor() {
            this.path = "member";
        }

        execute(parameter: object): Response {
            const cached = Cache.getOrMake<Member>(Member);
            const query = new ID(parameter);
            try {
                const member = cached.find((member) => member.id?.toString() == query.id)
                return Response.Success(member);
            } catch (e) {
                return Response.Failed("id was not specified")
            }
        }
    }
}