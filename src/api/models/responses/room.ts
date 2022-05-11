import { Member, RoomInfo } from ".";
import { Cacheable, Cache } from "../../../utils/caches";
import { DTO } from "../";


export class Room implements DTO, Cacheable<Room> {
  public readonly info: RoomInfo;
  public readonly inmates: Member[];
  readonly key: string;
  readonly cacheSourceSheetID: string;

  constructor(info: RoomInfo, inmates: Member[]) {
    this.info = info;
    this.inmates = inmates;
    this.key = "rooms";
    this.cacheSourceSheetID = PropertiesService.getScriptProperties().getProperty("ROOM_SHEET_ID");
  }

  fromSpreadsheet(spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet): Room[] {
    const range = spreadsheet.getRangeByName("Inmates");
    const values: string[][] = range.getValues().filter(value => value[0]);
    try {
      const infos = Array.from(new Map(values.map((value) => {
        const campus = value[2];
        const name = value[3];
        const key = campus + name;
        return [key, new RoomInfo(campus, name)];
      })).values());
      const cached = Cache.getOrMake<Member>(Member);
      return infos.map((info) => {
        const inmates = values.filter((value) => {
          return value[2] == info.campus && value[3] == info.name;
        }).map((value) => {
          return cached.find((member) => {
            return member.id.toString() == value[0];
          });
        });
        return new Room(info, inmates);
      });
    } catch (e) {
      return [];
    }
  }

  toInstances(cached: object[]): Room[] {
    return cached.map((cache) => {
      return Room.fromObject(cache);
    });
  }

  public static fromObject(obj: any): Room {
    try {
      const info = new RoomInfo(obj.info.campus, obj.info.name);
      const inmates = obj.inmates.map((inmate) => {
        return Member.fromObject(inmate);
      });
      return new Room(info, inmates);
    } catch (e) {
      return null;
    }
  }

  public toJSON() {
    return {
      info: this.info,
      inmates: this.inmates
    };
  }

  public entry(member: Member) {
    const id = PropertiesService.getScriptProperties().getProperty("ROOM_SHEET_ID");
    const spreadsheet = SpreadsheetApp.openById(id);
    const range = spreadsheet.getRangeByName("Inmates");
    const sheet = range.getSheet();
    sheet.appendRow([
      "",
      member.id,
      member.name,
      this.info.campus,
      this.info.name
    ]);
  }

  public exit(member: Member) {
    const cached = Cache.getOrMake<Room>(Room);
    const room = cached.find((room) => room.info.campus == this.info.campus && room.info.name == this.info.name)
    const id = PropertiesService.getScriptProperties().getProperty("ROOM_SHEET_ID");
    const spreadsheet = SpreadsheetApp.openById(id);
    const range = spreadsheet.getRangeByName("Inmates");
    const sheet = range.getSheet();
    const index = room.inmates.findIndex((value) => value == member) + 5;
    sheet.deleteRow(index);
  }
}