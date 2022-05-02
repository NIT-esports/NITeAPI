class Cache {
    static KEY = {
        member: "members",
        discord: "discords",
        game: "games",
        title: "titles",
    };
    static KEYS = Array.from(Object.values(Cache.KEY));

    static make() {
        const scriptProperties = PropertiesService.getScriptProperties();
        const id = scriptProperties.getProperty("NAME_LIST_SHEET_ID")
        const spreadsheet = SpreadsheetApp.openById(id);
        const memberDatas = spreadsheet.getRangeByName("MemberData").getValues();
        const discordDatas = spreadsheet.getRange("DiscordData").getValues();
        const gameDatas = spreadsheet.getRange("GameData").getValues();
        const gameTitles = spreadsheet.getRange("GameTitle").getValues()[0];
        const values = [
            JSON.stringify(memberDatas),
            JSON.stringify(discordDatas),
            JSON.stringify(gameDatas),
            JSON.stringify(gameTitles)
        ];
        const obj = [];
        for(let i = 0; i < Cache.KEYS.length; i++) {
            obj.push([Cache.KEYS[i], values[i]]);
        }
        const cache = Object.fromEntries(obj);
        CacheService.getScriptCache().putAll(cache, 21600);
    }

    static getOrMake() {
        const cache = CacheService.getScriptCache();
        const cached = cache.getAll(Cache.KEYS);
        if (Object.keys(cached).length != Cache.KEYS.length) {
            Cache.make();
        }
        return cache;
    }
}