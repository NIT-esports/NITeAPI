import { Discord } from "../responses";
import { Request } from "./request";

export class RegisterMember extends Request<RegisterMember> {
    id: number;
    name: string;
    discord: Discord;
}