import { Cache } from "../../caches";
import { Error, NoneResponse } from "../../models/responses";
import { ID } from "../../models/queries/id";
import { RegisterMember, UpdatedNickname } from "../../models/requests";
import { Member } from "../../models/responses";
import { Get, Post } from "../models/methodType";

export namespace MemberController {
    export class Index implements Get<Member> {
        path: string;

        constructor() {
            this.path = "member";
        }

        execute(parameter: object): Member | Error {
            const cached = Cache.getOrMake<Member>(Member);
            const query = new ID(parameter);
            const member = cached.find((member) => member.id?.toString() == query.id);
            return member || new Error(Utilities.formatString("The member with id %s did not exist", query.id));
        }
    }

    export class Update implements Post<NoneResponse> {
        path: string;

        constructor() {
            this.path = "member/update";
        }

        execute(parameter: object, postdata: object): NoneResponse | Error {
            const cached = Cache.getOrMake<Member>(Member);
            const query = new ID(parameter);
            const body = new UpdatedNickname(postdata);
            const index = cached.findIndex((member) => member.discord?.id == query.id);
            if (index < 0) {
                return new Error("Unregistered ID");
            }
            const id = PropertiesService.getScriptProperties().getProperty("NAME_LIST_SHEET_ID");
            const spreadsheet = SpreadsheetApp.openById(id);
            const range = spreadsheet.getRangeByName("DiscordData");
            const cell = range.getCell(index + 1, 2);
            cell.setValue(body.nickname);
            Cache.make<Member>(Member);
            return new NoneResponse();
        }
    }

    export class Register implements Post<NoneResponse> {
        path: string;

        constructor() {
            this.path = "member/register";
        }

        execute(parameter: object, postdata: object): NoneResponse | Error {
            const body = new RegisterMember(postdata);
            const id = PropertiesService.getScriptProperties().getProperty("NAME_LIST_SHEET_ID");
            const spreadsheet = SpreadsheetApp.openById(id);
            spreadsheet.appendRow(["", body.id, body.name, "", "", "", "", body.discord.id, body.discord.nickname]);
            Cache.make<Member>(Member);
            return new NoneResponse();
        }
    }
}