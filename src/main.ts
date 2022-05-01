import { MembersList, RoomAccessLogger } from "./controllers";
import { AccessInfo, AccessType, Discord, Member, Result, ResultState, Room, RoomInfo } from "./models";

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
  } else if(postdata.room.name && postdata.type && postdata.member.id) {
    const roomInfo = new RoomInfo(postdata.room.name)
    const member = MembersList.tryFind(postdata.member.id);
    const type = postdata.type == AccessType.ENTRY ? AccessType.ENTRY : AccessType.EXIT;
    const accessInfo = new AccessInfo(roomInfo, member, type);
    const room = new Room(postdata.room.name);
    if(postdata.type == AccessType.ENTRY) {
      room.entry(member)
    } else {
      room.exit(member);
    }
    RoomAccessLogger.log(accessInfo);
    return toJson(new Result(ResultState.SUCCESS, ""));
  }
}