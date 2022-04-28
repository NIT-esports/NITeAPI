const CACHE_KEYS = ["members", "discords", "games", "titles"];

class MembersList {
  constructor() {
    const obj = CacheService.getScriptCache().getAll(CACHE_KEYS);
    const caches = Object.keys(obj).length == CACHE_KEYS.length ? obj : MembersList.makeCache();
    console.log(caches);
    this.memberDatas = JSON.parse(caches.members);
    this.discordDatas = JSON.parse(caches.discords);
    this.gameDatas = JSON.parse(caches.games);
    this.gameTitles = JSON.parse(caches.titles);
  }

  static makeCache() {
    const spreadsheet = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty("NAME_LIST_SHEET_ID"));
    const memberDatas = spreadsheet.getRange(PropertiesService.getScriptProperties().getProperty("MEMBER_DATA")).getValues();
    const discordDatas = spreadsheet.getRange(PropertiesService.getScriptProperties().getProperty("DISCORD_DATA")).getValues();
    const gameDatas = spreadsheet.getRange(PropertiesService.getScriptProperties().getProperty("GAME_DATA")).getValues();
    const gameTitles = spreadsheet.getRange(PropertiesService.getScriptProperties().getProperty("GAME_TITLE")).getValues()[0];
    const values = [
      JSON.stringify(memberDatas),
      JSON.stringify(discordDatas),
      JSON.stringify(gameDatas),
      JSON.stringify(gameTitles)
    ];
    const cache = Object.fromEntries(_.zip.apply(_, [CACHE_KEYS, values]));
    console.log(values);
    CacheService.getScriptCache().putAll(cache, 21600);
    return cache;
  }

  search(target) {
    const index = this.indexOf(target);
    if (index < 0) {
      return null;
    }
    const member = this.memberDatas[index];
    const discord = this.discordDatas[index];
    const gameID = this.gameDatas[index];
    const titles = this.gameTitles;
    const games = Object.fromEntries(_.zip.apply(_, [titles, gameID]));
    return new MemberData(member, discord, games);
  }

  indexOf(target) {
    const values = target.toString().length < 10 ? this.memberDatas : this.discordDatas;
    return _.zip.apply(_, values)[0].indexOf(target.toString());
  }

  updateNickname(id, nickname) {
    const index = this.indexOf(id);
    if (index != -1) {
      const spreadsheet = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty("NAME_LIST_SHEET_ID"));
      const discords = spreadsheet.getRange(PropertiesService.getScriptProperties().getProperty("DISCORD_DATA"));
      const cell = discords.getCell(index + 1, 2);
      cell.setValue(nickname.toString());
    }

  }
}