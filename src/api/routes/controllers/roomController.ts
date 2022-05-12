import { Cache } from "../../caches";
import { APIResponse } from "../../models";
import { NameAndCampus } from "../../models/queries/nameAndCampus";
import { Room, Member, RoomInfo } from "../../models/responses";
import { Get, Post } from "../models/methodType";
import { AccessRequest } from "../../models/requests";
import { AccessInfo, AccessType, AccessLogger } from "../../logger";

export namespace RoomController {
    export class Index implements Get {
        path: string;

        constructor() {
            this.path = "room";
        }

        execute(parameter: object): APIResponse {
            const cached = Cache.getOrMake<Room>(Room);
            const query = new NameAndCampus(parameter);
            const rooms = cached.filter((room) => {
                return room.info.name == query.name || room.info.campus == query.campus
            });
            if (rooms.length) {
                return APIResponse.Success(rooms);
            }
            return APIResponse.Success(cached);
        }
    }
    export class Entry implements Post {
        path: string;

        constructor() {
            this.path = "room/entry";
        }

        execute(parameter: object, postdata: object): APIResponse {
            const req = new AccessRequest(postdata);
            const cached = Cache.getOrMake<Member>(Member);
            try {
                const member = cached.find((member) => member.id?.toString() == req.id);
                if (!member) {
                    return APIResponse.Failed(Utilities.formatString("No member with ID %s was found", req.id));
                }
                const info = new RoomInfo(req.place.campus, req.place.name);
                const accessInfo = new AccessInfo(info, member, AccessType.ENTRY);
                const room = Cache.getOrMake<Room>(Room).find((room) => {
                    return room.info.campus == info.campus && room.info.name == info.name;
                });
                if (room.inmates.some((inmate) => inmate.id == member.id)) {
                    room.entry(member);
                    Cache.make<Room>(Room);
                    AccessLogger.log(accessInfo);
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

        execute(parameter: object, postdata: object): APIResponse {
            const req = new AccessRequest(postdata);
            const cached = Cache.getOrMake<Member>(Member);
            try {
                const member = cached.find((member) => member.id?.toString() == req.id);
                if (!member) {
                    return APIResponse.Failed(Utilities.formatString("No member with ID %s was found", req.id));
                }
                const info = new RoomInfo(req.place.campus, req.place.name);
                const accessInfo = new AccessInfo(info, member, AccessType.EXIT);
                const room = Cache.getOrMake<Room>(Room).find((room) => {
                    return room.info.campus == info.campus && room.info.name == info.name;
                });
                if (room.inmates.some((inmate) => inmate.id == member.id)) {
                    room.exit(member);
                    Cache.make<Room>(Room);
                    AccessLogger.log(accessInfo);
                    return APIResponse.Success(null);
                }
                return APIResponse.Failed("Already exited the room");
            } catch (e) {
                return APIResponse.Failed(e.message);
            }
        }
    }
}