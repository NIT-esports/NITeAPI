import { Cache } from "../../caches";
import { NameAndCampus } from "../../models/queries/nameAndCampus";
import { Error, Room, Member, RoomInfo, NoneResponse } from "../../models/responses";
import { Get, Post } from "../models/methodType";
import { AccessRequest } from "../../models/requests";
import { AccessInfo, AccessType, AccessLogger } from "../../logger";

export namespace RoomController {
    export class Index implements Get<Room> {
        path: string;

        constructor() {
            this.path = "room";
        }

        execute(parameter: object): Room[] | Error {
            const cached = Cache.getOrMake<Room>(Room);
            const query = new NameAndCampus(parameter);
            if (!query.campus && !query.name) {
                return cached;
            }
            const rooms = cached.filter((room) => {
                return room.info.name == query.name || room.info.campus == query.campus
            });
            if (rooms.length) {
                return rooms;
            }
            return new Error("No rooms were found for the specified criteria.")
        }
    }
    export class Entry implements Post<NoneResponse> {
        path: string;

        constructor() {
            this.path = "room/entry";
        }

        execute(parameter: object, postdata: object): NoneResponse | Error {
            const req = new AccessRequest(postdata);
            const cached = Cache.getOrMake<Member>(Member);
            const member = cached.find((member) => member.id?.toString() == req.id);
            if (!member) {
                return new Error(Utilities.formatString("No member with ID %s was found", req.id));
            }
            const info = new RoomInfo(req.place.campus, req.place.name);
            const accessInfo = new AccessInfo(info, member, AccessType.ENTRY);
            const room = Cache.getOrMake<Room>(Room).find((room) => {
                return room.info.campus == info.campus && room.info.name == info.name;
            }) || new Room(info, []);
            if (!room.inmates.some((inmate) => inmate.id == member.id)) {
                room.entry(member);
                Cache.make<Room>(Room);
                AccessLogger.log(accessInfo);
                return new NoneResponse();
            }
            return new Error("Already entered the room");
        }
    }
    export class Exit implements Post<NoneResponse> {
        path: string;

        constructor() {
            this.path = "room/exit";
        }

        execute(parameter: object, postdata: object): NoneResponse | Error {
            const req = new AccessRequest(postdata);
            const cached = Cache.getOrMake<Member>(Member);
            const member = cached.find((member) => member.id?.toString() == req.id);
            if (!member) {
                return new Error(Utilities.formatString("No member with ID %s was found", req.id));
            }
            const info = new RoomInfo(req.place.campus, req.place.name);
            const accessInfo = new AccessInfo(info, member, AccessType.EXIT);
            const room = Cache.getOrMake<Room>(Room).find((room) => {
                return room.info.campus == info.campus && room.info.name == info.name;
            });
            if (room && room.inmates.some((inmate) => inmate.id == member.id)) {
                room.exit(member);
                Cache.make<Room>(Room);
                AccessLogger.log(accessInfo);
                return new NoneResponse();
            }
            return new Error("Already exited the room");
        }
    }
}