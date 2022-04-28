const _ = Underscore.load();

function toJson(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  const query = e.parameter;
  if (query.campus) {
    const room = new Room(query.campus);
    return toJson(room);
  } else {
    return toJson(null);
  }
}

function doPost(e) {
  let accessData;
  try {
    accessData = RoomAccessData.parse(e.postData.contents);
  } catch(e) {
    return toJson(new RoomAccessResult("ERROR", "型情報が違います"));
  }
  if (!accessData.isSafe()) {
    return toJson(new RoomAccessResult("ERROR", Utilities.formatString("すでに%sしています", accessData.type)));
  }
  accessData.room.access(accessData);
  return toJson(new RoomAccessResult("SUCCESS", ""));
}