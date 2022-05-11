import { Discord, Game, Response } from ".";
import { Cacheable } from "../../caches";

export class Member extends Response<Member> implements Cacheable<Member> {
  readonly id: number;
  readonly name: string;
  readonly discord: Discord;
  readonly games: Game[];
  readonly key: string;
  readonly cacheSourceSheetID: string;

  constructor()
  constructor(partial: Partial<Member>)
  constructor(id: number, name: string, discord: Discord, games: Game[])
  constructor(idOrPartial?: number | Partial<Member>, name?: string, discord?: Discord, games?: Game[]) {
    if (!idOrPartial) {
      super({});
      this.key = "members";
      this.cacheSourceSheetID = PropertiesService.getScriptProperties().getProperty("NAME_LIST_SHEET_ID");
    } else if (typeof idOrPartial == "number") {
      super({});
      this.id = idOrPartial;
      this.name = name;
      this.discord = discord;
      this.games = games;
    } else {
      super(idOrPartial);
    }
  }

  toJSON(): object {
    return {
      id: this.id,
      name: this.name,
      discord: this.discord,
      games: this.games
    };
  }

  fromSpreadsheet(spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet): Member[] {
    const memberDatas: string[][] = spreadsheet.getRangeByName("MemberData").getValues();
    const discordDatas: string[][] = spreadsheet.getRange("DiscordData").getValues();
    const gameIDs: string[][] = spreadsheet.getRange("GameData").getValues();
    const gameTitles: string[] = spreadsheet.getRange("GameTitle").getValues()[0];
    const members: Member[] = [];
    for (let i = 0; i < memberDatas.length; i++) {
      const memberData = memberDatas[i];
      const discordData = discordDatas[i];
      const gameID = gameIDs[i];
      const discord = new Discord(discordData[0], discordData[1]);
      const games = gameTitles.map((title, index) => {
        return new Game(title, gameID[index]);
      });
      const member = new Member(Number.parseInt(memberData[0]), memberData[1], discord, games);
      members.push(member);
    }
    return members;
  }

  toInstances(cached: object[]): Member[] {
    return cached.map((cache) => {
      return new Member(cache);
    });
  }
}