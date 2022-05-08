import { Cacheable } from ".";

export class Cache {
    public static get<T extends Cacheable<T>>(t: { new (...args: any): T }): T[] {
        const cls = new t();
        const json = CacheService.getScriptCache().get(cls.key);
        const cached: object[] = JSON.parse(json);
        if (cached) {
            return cls.toInstances(cached);
        } else {
            return null;
        }
    }

    public static getOrMake<T extends Cacheable<T>>(t: { new (...args: any): T }): T[] {
        return Cache.get(t) || Cache.make(t);
    }

    public static make<T extends Cacheable<T>>(t: { new (...args: any): T }): T[] {
        const cls = new t();
        const spreadsheet = SpreadsheetApp.openById(cls.cacheSourceSheetID);
        const datas = cls.fromSpreadsheet(spreadsheet);
        const cache = Object.fromEntries([[cls.key, JSON.stringify(datas)]]);
        CacheService.getScriptCache().putAll(cache, 21600);
        return datas;
    }
}