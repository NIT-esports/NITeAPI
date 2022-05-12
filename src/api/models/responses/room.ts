import { Member, Response, RoomInfo } from ".";
import { Cacheable, Cache } from "../../caches";


export class Room extends Response<Room> implements Cacheable<Room> {
  public readonly info: RoomInfo;
  public readonly inmates: Member[];
  readonly key: string;
  readonly cacheSourceSheetID: string;

  constructor()
  constructor(partial: Partial<Room>)
  constructor(info: RoomInfo, inmates: Member[])
  constructor(infoOrPartial?: RoomInfo | Partial<Room>, inmates?: Member[]) {
    if (!infoOrPartial) {
      super({});
      this.key = "rooms";
      this.cacheSourceSheetID = PropertiesService.getScriptProperties().getProperty("ROOM_SHEET_ID");
    } else if (infoOrPartial instanceof RoomInfo) {
      super({});
      this.info = infoOrPartial;
      this.inmates = inmates;
    } else {
      super(infoOrPartial);
    }
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
            return member.id?.toString() == value[0];
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
      return new Room(cache);
    });
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
    const index = room.inmates.findIndex((value) => value.id == member.id) + 5;
    sheet.deleteRow(index);
  }
}