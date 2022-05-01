import { Result } from "./models";
import { AccessInfo, Room } from "./models/rooms";

function toJson(data: any) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e: any) {
  const query = e.parameter;
  if (query.name) {
    const room = new Room(query.name);
    return toJson(room);
  } else {
    return toJson(null);
  }
}

function doPost(e: any) {
  let accessInfo: AccessInfo;
  try {
    accessInfo = AccessInfo.parse(e.postData.contents);
  } catch(e) {
    return toJson(new Result("ERROR", "型情報が違います"));
  }
  const room = new Room(accessInfo.room.name);
  room.access(accessInfo);
  return toJson(new Result("SUCCESS", ""));
}