import { RoomAccessLogger } from "../../logger";
import { AccessInfo, AccessType } from "../../logger/models";
import { Cache } from "../../caches";
import { APIResponse } from "../../models";
import { NameAndCampus } from "../../models/queries/nameAndCampus";
import { Room, Member, RoomInfo } from "../../models/responses";
import { Get, Post } from "../models/methodType";

export namespace RoomController {
    export class Index implements Get {
        path: string;

        constructor() {
            this.path = "room";
        }

        execute(parameter: object): APIResponse {
            try {
                const query = new NameAndCampus(parameter);
                const room = Cache.getOrMake<Room>(Room).find((value) => {
                    return value.info.name == query.name;
                });
                return APIResponse.Success(room);
            } catch (e) {
                return APIResponse.Failed("Room name not specified");
            }
        }
    }
    export class Entry implements Post {
        path: string;

        constructor() {
            this.path = "room/entry";
        }

        execute(parameter: object, postdata: { [key: string]: any; }): APIResponse {
            const cached = Cache.getOrMake<Member>(Member);
            try {
                const member = cached.find((member) => member.id == postdata.member.id);
                if (member) {
                    return APIResponse.Failed(Utilities.formatString("No member with ID %s was found", postdata.member.id));
                }
                const info = new RoomInfo(postdata.room.campus, postdata.room.name);
                const accessInfo = new AccessInfo(info, member, AccessType.ENTRY);
                const room = Cache.getOrMake<Room>(Room).find((room) => {
                    return room.info.campus == info.campus && room.info.name == info.name;
                });
                if (room.inmates.some((inmate) => inmate.id == member.id)) {
                    room.entry(member);
                    Cache.make<Room>(Room);
                    RoomAccessLogger.log(accessInfo);
                    return APIResponse.Success(null);
                }
                return APIResponse.Failed("Already entered the room");
            } catch (e) {
                return APIResponse.Failed(e.message);
            }
        }
    }
    export class Exit implements Post {
        path: string;

        constructor() {
            this.path = "room/exit";
        }

        execute(parameter: object, postdata: { [key: string]: any; }): APIResponse {
            const cached = Cache.getOrMake<Member>(Member);
            try {
                const member = cached.find((member) => member.id == postdata.member.id);
                if (member) {
                    return APIResponse.Failed(Utilities.formatString("No member with ID %s was found", postdata.member.id));
                }
                const info = new RoomInfo(postdata.room.campus, postdata.room.name);
                const accessInfo = new AccessInfo(info, member, AccessType.EXIT);
                const room = Cache.getOrMake<Room>(Room).find((room) => {
                    return room.info.campus == info.campus && room.info.name == info.name;
                });
                if (room.inmates.some((inmate) => inmate.id == member.id)) {
                    room.entry(member);
                    Cache.make<Room>(Room);
                    RoomAccessLogger.log(accessInfo);
                    return APIResponse.Success(null);
                }
                return APIResponse.Failed("Already exited the room");
            } catch (e) {
                return APIResponse.Failed(e.message);
            }
        }
    }
}