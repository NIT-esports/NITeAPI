import { Member, RoomInfo } from ".";
import { Response } from "../api/models";
import { Cacheable, RoomCache } from "../utils/caches";

export interface Room extends Cacheable<typeof Room> { }
export class Room implements Response, Cacheable<typeof Room> {
  public static readonly CACHE = new RoomCache();

  public readonly info: RoomInfo;
  public readonly inmates: Member[];

  constructor(info: RoomInfo, inmates: Member[]) {
    this.info = info;
    this.inmates = inmates;
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

  static fromCacheOrDefault(info: RoomInfo): Room {
    return Room.CACHE.get().find((room) => {
      return room.info.campus == info.campus && room.info.name == info.name;
    }) || new Room(info, []);
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
    const cached = (Room.CACHE.get() || Room.CACHE.make()).find((value) => {
      return value.info == this.info;
    });
    const id = PropertiesService.getScriptProperties().getProperty("ROOM_SHEET_ID");
    const spreadsheet = SpreadsheetApp.openById(id);
    const range = spreadsheet.getRangeByName("Inmates");
    const sheet = range.getSheet();
    const index = cached.inmates.findIndex((value) => value == member) + 5;
    sheet.deleteRow(index);
  }
}