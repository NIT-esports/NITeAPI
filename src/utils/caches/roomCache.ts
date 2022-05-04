import { Cache } from ".";
import { MembersList } from "../../controllers";
import { Room, RoomInfo } from "../../models";

export class RoomCache extends Cache<Room> {
    constructor() {
        const scriptProperties = PropertiesService.getScriptProperties();
        const id = scriptProperties.getProperty("ROOM_SHEET_ID");
        super(id, "rooms");
    }

    protected fromSpreadsheet(spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet): Room[] {
        const list = new MembersList();
        const range = spreadsheet.getRangeByName("Inmates");
        const values: string[][] = range.getValues().filter(value => value[0]);
        try {
            const infos = Array.from(new Map(values.map((value) => {
                const campus = value[2];
                const name = value[3];
                const key = campus + name;
                return [key, new RoomInfo(campus, name)];
            })).values());
            return infos.map((info) => {
                const inmates = values.filter((value) => {
                    return value[2] == info.campus && value[3] == info.name;
                }).map((value) => {
                    return list.findByID(value[0]);
                });
                return new Room(info, inmates);
            });
        } catch (e) {
            return [];
        }
    }

    protected toInstances(cached: object[]): Room[] {
        return cached.map((cache) => {
            return Room.fromObject(cache);
        });
    }

}