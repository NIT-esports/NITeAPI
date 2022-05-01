import { Result } from "./models";
import { AccessInfo, Room } from "./models/rooms";

function toJson(data: any) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function makeCache() {
  Cache.make();
}

function doGet(e: any) {
  const query = e.parameter;
  if (query.id) {
    const data = MembersList.tryFind(query.id);
    return toJson(data);
  }
  if (query.name) {
    const room = new Room(query.name);
    return toJson(room);
  } else {
    return toJson(null);
  }
}

function doPost(e: any) {
  const postdata = JSON.parse(e.postData.contents);
  if (postdata.id && postdata.nickname) {
    if (MembersList.isRegistedById(postdata.id)) {
      MembersList.update(new Discord(postdata.id, postdata.nickname));
    } else {
      const discord = new Discord(postdata.id, postdata.nickname);
      const member = new Member(0, "", discord, []);
      MembersList.regist(member);
    }
  } else {
    let accessInfo: AccessInfo;
    try {
      accessInfo = AccessInfo.parse(e.postData.contents);
    } catch (e) {
      return toJson(new Result("ERROR", "型情報が違います"));
    }
    const room = new Room(accessInfo.room.name);
    room.access(accessInfo);
    return toJson(new Result("SUCCESS", ""));
  }
}