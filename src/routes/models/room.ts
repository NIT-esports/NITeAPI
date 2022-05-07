import { Get, Post } from "..";
import { MembersList, RoomAccessLogger } from "../../controllers";
import { AccessInfo, AccessType, Result, ResultState, Room as RoomModel, RoomInfo } from "../../models";

export class Room implements Get {
    path: string;

    constructor() {
        this.path = "room";
    }

    execute(query: { [key: string]: any; }): Result {
        try {
            const room = (RoomModel.CACHE.get() || RoomModel.CACHE.make()).find((value) => {
                return value.info.name == query.name;
            });
            return new Result(ResultState.SUCCESS, "", room);
        } catch (e) {
            return new Result(ResultState.FAILED, "Room name not specified", null);
        }
    }
}

export class RoomEntry implements Post {
    path: string;

    constructor() {
        this.path = "room/entry";
    }

    execute(query: { [key: string]: any; }, postdata: { [key: string]: any; }): Result {
        const list = new MembersList();
        try {
            const member = list.findByID(postdata.member.id);
            if (member) {
                return new Result(ResultState.FAILED, Utilities.formatString("No member with ID %s was found", postdata.member.id), null);
            }
            const info = new RoomInfo(postdata.room.campus, postdata.room.name);
            const accessInfo = new AccessInfo(info, member, AccessType.ENTRY);
            const room = RoomModel.fromCacheOrDefault(info);
            if (room.inmates.some((inmate) => inmate.id == member.id)) {
                room.entry(member);
                RoomModel.CACHE.make();
                RoomAccessLogger.log(accessInfo);
                return new Result(ResultState.SUCCESS, "", null);
            }
            return new Result(ResultState.FAILED, "Already entered the room", null);
        } catch (e) {
            return new Result(ResultState.FAILED, e.message, null);
        }
    }
}

export class RoomExit implements Post {
    path: string;

    constructor() {
        this.path = "room/exit";
    }

    execute(query: { [key: string]: any; }, postdata: { [key: string]: any; }): Result {
        const list = new MembersList();
        try {
            const member = list.findByID(postdata.member.id);
            if (member) {
                return new Result(ResultState.FAILED, Utilities.formatString("No member with ID %s was found", postdata.member.id), null);
            }
            const info = new RoomInfo(postdata.room.campus, postdata.room.name);
            const accessInfo = new AccessInfo(info, member, AccessType.EXIT);
            const room = RoomModel.fromCacheOrDefault(info);
            if (room.inmates.some((inmate) => inmate.id == member.id)) {
                room.entry(member);
                RoomModel.CACHE.make();
                RoomAccessLogger.log(accessInfo);
                return new Result(ResultState.SUCCESS, "", null);
            }
            return new Result(ResultState.FAILED, "Already exited the room", null);
        } catch (e) {
            return new Result(ResultState.FAILED, e.message, null);
        }
    }
}