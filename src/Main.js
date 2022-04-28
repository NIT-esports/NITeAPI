const _ = Underscore.load();

function makeCache() {
  MembersList.makeCache();
}

function toJson(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  const params = e.parameter;
  if (!params.id) {
    return toJson(null);
  }
  const list = new MembersList();
  const data = list.search(params.id);
  return toJson(data);
}

function doPost(e) {
  const postdata = JSON.parse(e.postData.contents);
  if (postdata.id && postdata.nickname) {
    const list = new MembersList();
    if (list.search(postdata.id)) {
      list.updateNickname(postdata.id, postdata.nickname);
    } else {
      const spreadsheet = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty("NAME_LIST_SHEET_ID"));
      spreadsheet.appendRow(["", "", "", "", "", "", "", postdata.id, postdata.nickname]);
    }
  }
  return toJson(null);
}