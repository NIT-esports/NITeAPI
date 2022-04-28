class Log {
  static write(content) {
    const id = PropertiesService.getScriptProperties().getProperty("LOG_SHEET_ID");
    const spreadsheet = SpreadsheetApp.openById(id);
    const sheet = spreadsheet.getSheets()[0];
    sheet.appendRow(content.toLog());
    const lastRow = sheet.getLastRow();
    const lastCol = sheet.getLastColumn();
    const range = sheet.getRange(lastRow, 2, 1, lastCol - 1);
    range.setBorder(true, true, true, true, true, false);
    range.setHorizontalAlignment("center");
  }
}