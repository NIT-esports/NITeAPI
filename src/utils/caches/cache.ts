import { Cacheable } from ".";

export abstract class Cache<T extends Cacheable<any>> {
    protected readonly _sheetID: string;
    public readonly key: string;

    constructor(sheetID: string, key: string) {
        this._sheetID = sheetID;
        this.key = key;
    }

    protected abstract fromSpreadsheet(spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet): T[];
    protected abstract toInstances(cached: object[]): T[];

    public get(): T[] {
        const json = CacheService.getScriptCache().get(this.key);
        const cached: object[] = JSON.parse(json);
        if (cached) {
            return this.toInstances(cached);
        } else {
            return null;
        }
    }

    public make(): T[] {
        const spreadsheet = SpreadsheetApp.openById(this._sheetID);
        const datas = this.fromSpreadsheet(spreadsheet);
        const cache = Object.fromEntries([[this.key, JSON.stringify(datas)]]);
        CacheService.getScriptCache().putAll(cache, 21600);
        return datas;
    }
}