import { Member, RoomInfo } from ".";
import { MembersList } from "../controllers";

export class Room {
  _sheet: GoogleAppsScript.Spreadsheet.Sheet
  info: RoomInfo;
  inmates: Member[];
  
  constructor(name: string) {
    const id = PropertiesService.getScriptProperties().getProperty("ROOM_SHEET_ID");
    const spreadsheet = SpreadsheetApp.openById(id);
    const range = spreadsheet.getRangeByName(name.insertAt(1, "_"));
    const values: string[][] = range.getValues();
    CacheService.getScriptCache().put(name, JSON.stringify(values));
    this._sheet = range.getSheet();
    this.info = new RoomInfo(name);
    this.inmates = values.filter((value, index) => {
      return value[0];
    }).map((data, index) => {
      const member = MembersList.tryFind(data[0]);
      return member;
    });
  }

  toJSON() {
    return {
      info: this.info,
      inmates: this.inmates
    };
  }

  entry(member: Member) {
    this.inmates.push(member);
    this._sheet.appendRow([
      "",
      member.id,
      member.name,
      member.discord.id,
      member.discord.nickname
    ]);
  }

  exit(member: Member) {
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