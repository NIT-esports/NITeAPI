import { Discord, Game } from ".";
import { Cacheable } from "../../caches";
import { DTO } from "../";

export class Member implements DTO, Cacheable<Member> {
  readonly id: number;
  readonly name: string;
  readonly discord: Discord;
  readonly games: Game[];
  readonly key: string;
  readonly cacheSourceSheetID: string;

  constructor(id: number, name: string, discord: Discord, games: Game[]) {
    this.id = id;
    this.name = name;
    this.discord = discord;
    this.games = games;
    this.key = "members";
    this.cacheSourceSheetID = PropertiesService.getScriptProperties().getProperty("NAME_LIST_SHEET_ID");
  }

  static fromObject(obj: any): Member {
    try {
      const discord = new Discord(obj.discord.id, obj.discord.nickname);
      const games = obj.games.map((game) => {
        return new Game(game.title, game.id);
      });
      return new Member(obj.id, obj.name, discord, games);
    } catch (e) {
      return null;
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
      return Member.fromObject(cache);
    });
  }
}