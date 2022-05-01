import { AccessType, RoomInfo } from ".";
import { Discord, Member } from "..";
import { Log } from "../../utils/Loggers";

export class AccessInfo implements Log {
  room: RoomInfo;
  member: Member;
  type: AccessType;
  time: Date;
  
  constructor(room: RoomInfo, member: Member, type: AccessType) {
    this.room = room;
    this.member = member;
    this.type = type;
    this.time = new Date();
  }

  static parse(json: string) {
    const obj = JSON.parse(json);
    const room = new RoomInfo(obj.room.name, obj.room.campus);
    const discord = new Discord(obj.member.discord.id, obj.member.discord.nickname);
    const member = new Member(obj.member.id, obj.member.name, discord);
    const type = obj.type == "入室" ? AccessType.ENTRY : AccessType.EXIT;
    return new AccessInfo(room, member, type);
  }

  toLog(): string[] {
    return [
      this.member.id.toString(),
      this.member.name,
      this.room.campus,
      this.type,
      Utilities.formatDate(this.time, "Asia/Tokyo", Utilities.formatString("dd日(%s)", this.time.getDayToJapanese())),
      Utilities.formatDate(this.time, "Asia/Tokyo", "HH:mm")
    ];
  }
}