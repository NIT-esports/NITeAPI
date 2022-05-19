import { Request } from "./request";

export class UpdatedNickname extends Request<UpdatedNickname> {
    nickname: string;
}