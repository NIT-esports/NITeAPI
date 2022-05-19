import { DTO } from "..";
import { Discord } from "../responses";

export class RegisterMember extends DTO<RegisterMember> {
    id: number;
    name: string;
    discord: Discord;
}