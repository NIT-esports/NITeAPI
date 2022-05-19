import { AccessType } from ".";
import { RoomInfo, Member } from "../../models/responses";

export class AccessInfo {
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

  toLog(): string[] {
    return [
      "",
      this.member.id.toString(),
      this.member.name,
      this.room.name,
      this.type,
      Utilities.formatDate(this.time, "Asia/Tokyo", Utilities.formatString("dd日(%s)", this.time.getDayToJapanese())),
      Utilities.formatDate(this.time, "Asia/Tokyo", "HH:mm")
    ];
  }
}