import { Discord, Game, Member } from "../../models";
import { Cache } from ".";

export class MembersCache extends Cache<Member> {
    constructor() {
        const scriptProperties = PropertiesService.getScriptProperties();
        const id = scriptProperties.getProperty("NAME_LIST_SHEET_ID");
        super(id, "members");
    }

    protected fromSpreadsheet(spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet): Member[] {
        const memberDatas: string[][] = spreadsheet.getRangeByName("MemberData").getValues();
        const discordDatas: string[][] = spreadsheet.getRange("DiscordData").getValues();
        const gameIDs: string[][] = spreadsheet.getRange("GameData").getValues();
        const gameTitles: string[] = spreadsheet.getRange("GameTitle").getValues()[0];
        const members: Member[] = [];
        for(let i = 0; i < memberDatas.length; i++) {
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

    protected toInstances(cached: object[]): Member[] {
        return cached.map((cache) => {
            return Member.fromObject(cache);
        });
    }
}