import { AccessInfo, AccessType, RoomInfo } from ".";
import { Discord, Member } from "..";
import { Logger } from "../../utils/Loggers";

export class Room {
  _sheet: GoogleAppsScript.Spreadsheet.Sheet
  info: RoomInfo;
  inmates: Member[];
  
  constructor(name: string) {
    const id = PropertiesService.getScriptProperties().getProperty("ROOM_SHEET_ID");
    const spreadsheet = SpreadsheetApp.openById(id);
    const range = spreadsheet.getRangeByName(name.insertAt(1, "_"));
    const values: string[][] = range.getValues();
    const campus = range.getSheet().getName();
    CacheService.getScriptCache().put(name, JSON.stringify(values));
    this._sheet = range.getSheet();
    this.info = new RoomInfo(name, campus);
    this.inmates = values.filter((value, index) => {
      return value[0];
    }).map((data, index) => {
      const id = Number.parseInt(data[0]);
      const name = data[1];
      const discord = new Discord(data[2], data[3]);
      return new Member(id, name, discord);
    });
  }

  toJSON() {
    return {
      info: this.info,
      inmates: this.inmates
    };
  }

  access(info: AccessInfo) {
    Logger.write(info);
    if (info.type == AccessType.ENTRY) {
      this.entry(info.member);
    } else {
      this.exit(info.member);
    }
  }

  private entry(member: Member) {
    this.inmates.push(member);
    this._sheet.appendRow([
      "",
      member.id,
      member.name,
      member.discord.id,
      member.discord.nickname
    ]);
  }

  private exit(member: Member) {
    const json = CacheService.getScriptCache().get(this.info.name);
    const values: string[][] = JSON.parse(json);
    const transValues = Object.keys(values[0]).map((c) => {
      return values.map((r) => {
        return r[c];
      });
    });
    const index = transValues[0].indexOf(member.id) + 5;
    this._sheet.deleteRow(index);
    this.inmates = this.inmates.filter((inmate, i) => {
      return i != index - 5;
    })
  }
}