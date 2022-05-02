import { MembersList, RoomAccessLogger } from "./controllers";
import { AccessInfo, AccessType, Discord, Member, Result, ResultState, Room, RoomInfo } from "./models";

function toJson(data: any) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e: any) {
  const query = e.parameter;
  if (query.id) {
    const list = new MembersList();
    const member = list.findByID(query.id);
    if(member) {
      return toJson(new Result(ResultState.SUCCESS, "", member));
    }
    return toJson(new Result(ResultState.FAILED, "No member with that ID was found.", null));
  }
  else if (query.name) {
    const room = new Room(query.name);
    return toJson(new Result(ResultState.SUCCESS, "", room));
  } else {
    return toJson(null);
  }
}

function doPost(e: any) {
  const postdata = JSON.parse(e.postData.contents);
  const list = new MembersList();
  if (postdata.id && postdata.nickname) {
    if (list.isRegistedByID(postdata.id)) {
      list.updateOfDiscord(new Discord(postdata.id, postdata.nickname));
    } else {
      const discord = new Discord(postdata.id, postdata.nickname);
      const member = new Member(0, "", discord, []);
      list.register(member);
    }
  } else if(postdata.room.name && postdata.type && postdata.member.id) {
    const roomInfo = new RoomInfo(postdata.room.name)
    const member = list.findByID(postdata.member.id);
    const type = postdata.type == AccessType.ENTRY ? AccessType.ENTRY : AccessType.EXIT;
    const accessInfo = new AccessInfo(roomInfo, member, type);
    const room = new Room(postdata.room.name);
    if(postdata.type == AccessType.ENTRY) {
      room.entry(member)
    } else {
      room.exit(member);
    }
    RoomAccessLogger.log(accessInfo);
  }
}