export interface Cacheable<T> {
    readonly key: string 
    readonly cacheSourceSheetID: string
    fromSpreadsheet(spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet): T[];
    toInstances(cached: object[]): T[];
}