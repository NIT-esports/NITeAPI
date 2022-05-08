import { Get, Post } from "..";
import { RoomAccessLogger } from "../../../controllers";
import { AccessInfo, AccessType, Member, Room as RoomModel, RoomInfo } from "../../../models";
import { Cache } from "../../../utils/caches";
import { Result } from "../../models";

export class Room implements Get {
    path: string;

    constructor() {
        this.path = "room";
    }

    execute(query: { [key: string]: any; }): Result {
        try {
            const room = Cache.getOrMake<RoomModel>(RoomModel).find((value) => {
                return value.info.name == query.name;
            });
            return Result.Success(room);
        } catch (e) {
            return Result.Failed("Room name not specified");
        }
    }
}

export class RoomEntry implements Post {
    path: string;

    constructor() {
        this.path = "room/entry";
    }

    execute(query: { [key: string]: any; }, postdata: { [key: string]: any; }): Result {
        const cached = Cache.getOrMake<Member>(Member);
        try {
            const member = cached.find((member) => member.id == postdata.member.id);
            if (member) {
                return Result.Failed(Utilities.formatString("No member with ID %s was found", postdata.member.id));
            }
            const info = new RoomInfo(postdata.room.campus, postdata.room.name);
            const accessInfo = new AccessInfo(info, member, AccessType.ENTRY);
            const room = Cache.getOrMake<RoomModel>(RoomModel).find((room) => {
                return room.info.campus == info.campus && room.info.name == info.name;
            });
            if (room.inmates.some((inmate) => inmate.id == member.id)) {
                room.entry(member);
                Cache.make<RoomModel>(RoomModel);
                RoomAccessLogger.log(accessInfo);
                return Result.Success(null);
            }
            return Result.Failed("Already entered the room");
        } catch (e) {
            return Result.Failed(e.message);
        }
    }
}

export class RoomExit implements Post {
    path: string;

    constructor() {
        this.path = "room/exit";
    }

    execute(query: { [key: string]: any; }, postdata: { [key: string]: any; }): Result {
        const cached = Cache.getOrMake<Member>(Member);
        try {
            const member = cached.find((member) => member.id == postdata.member.id);
            if (member) {
                return Result.Failed(Utilities.formatString("No member with ID %s was found", postdata.member.id));
            }
            const info = new RoomInfo(postdata.room.campus, postdata.room.name);
            const accessInfo = new AccessInfo(info, member, AccessType.EXIT);
            const room = Cache.getOrMake<RoomModel>(RoomModel).find((room) => {
                return room.info.campus == info.campus && room.info.name == info.name;
            });
            if (room.inmates.some((inmate) => inmate.id == member.id)) {
                room.entry(member);
                Cache.make<RoomModel>(RoomModel);
                RoomAccessLogger.log(accessInfo);
                return Result.Success(null);
            }
            return Result.Failed("Already exited the room");
        } catch (e) {
            return Result.Failed(e.message);
        }
    }
}