class MembersList {
  static search(target: string): Member {
    const index = this.indexOf(target);
    if (index == -1) {
      return null;
    }
    const cache = Cache.getOrMake();
    const memberData: string[] = JSON.parse(cache.get(Cache.KEY.member))[index];
    const discordData: string[] = JSON.parse(cache.get(Cache.KEY.discord))[index];
    const gameData: string[] = JSON.parse(cache.get(Cache.KEY.game))[index];
    const title: string[] = JSON.parse(cache.get(Cache.KEY.title));
    const id: number = Number.parseInt(memberData[0]);
    const name: string = memberData[1];
    const discord = new Discord(discordData[0], discordData[1]);
    const games: Game[] = [];
    for (let i = 0; i < title.length; i++) {
      games.push(new Game(title[i], gameData[i]));
    }
    return new Member(id, name, discord, games);
  }

  static indexOf(id: string | number): number {
    const cache = Cache.getOrMake();
    const data = id.toString().length < 10 ? cache.get(Cache.KEY.member) : cache.get(Cache.KEY.discord);
    const values: string[][] = JSON.parse(data);
    const reverse: string[][] = Object.keys(values[0]).map((c) => {
      return values.map((r) => {
        return r[c];
      });
    });
    return reverse[0].indexOf(id.toString());
  }

  static update(newData: Discord) {
    const index = MembersList.indexOf(newData.id);
    if (index != -1) {
      const id = PropertiesService.getScriptProperties().getProperty("NAME_LIST_SHEET_ID");
      const spreadsheet = SpreadsheetApp.openById(id);
      const range = spreadsheet.getRangeByName("DiscordData");
      const cell = range.getCell(index + 1, 2);
      cell.setValue(newData.nickname);
    }

  }
}