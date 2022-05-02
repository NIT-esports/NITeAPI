import { Member, Discord } from "../models";
import { MembersCache } from "../utils/caches";

export class MembersList {
  public static readonly CACHE = new MembersCache();

  public findByID(id: string): Member {
    const cached = MembersList.CACHE.get() || MembersList.CACHE.make();
    return cached.find((member: Member) => {
      return id == member.id.toString() || id == member.discord.id;
    });
  }

  public indexOf(id: string): number {
    const target = this.findByID(id);
    const cached = MembersList.CACHE.get();
    return cached.indexOf(target);
  }

  public updateOfDiscord(newData: Discord): void {
    const id = PropertiesService.getScriptProperties().getProperty("NAME_LIST_SHEET_ID");
    const spreadsheet = SpreadsheetApp.openById(id);
    const range = spreadsheet.getRangeByName("DiscordData");
    const index = this.indexOf(newData.id);
    const cell = range.getCell(index + 1, 2);
    cell.setValue(newData.nickname);
    MembersList.CACHE.make();
  }

  public register(member: Member): void {
    const id = PropertiesService.getScriptProperties().getProperty("NAME_LIST_SHEET_ID");
    const spreadsheet = SpreadsheetApp.openById(id);
    spreadsheet.appendRow(["", member.id, member.name, "", "", "", "", member.discord.id, member.discord.nickname]);
    MembersList.CACHE.make();
  }

  public isRegistedByID(id: string): boolean {
    return this.findByID(id) != null;
  }
}
