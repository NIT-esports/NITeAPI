const _ = Underscore.load();

function toJson(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e: any) {
  const params = e.parameter;
  if (!params.id) {
    return toJson(null);
  }
  const data = MembersList.search(params.id);
  return toJson(data);
}

function doPost(e: any) {
  const postdata = JSON.parse(e.postData.contents);
  if (postdata.id && postdata.nickname) {
    if (MembersList.search(postdata.id)) {
      MembersList.update(new DiscordData(postdata.id, postdata.nickname));
    } else {
      const spreadsheet = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty("NAME_LIST_SHEET_ID"));
      spreadsheet.appendRow(["", "", "", "", "", "", "", postdata.id, postdata.nickname]);
    }
  }
  return toJson(null);
}