const WEEKS = ["日", "月", "火", "水", "木", "金", "土"];

class RoomAccessData {
  constructor(room, member, type) {
    this.room = room;
    this.member = member;
    this.type = type;
    this.timestamp = new Date();
  }

  static parse(json) {
    const obj = JSON.parse(json);
    const room = new Room(obj.campus);
    const member = new MemberData(obj.member.id, obj.member.name, obj.member.discord.id, obj.member.discord.nickname);
    const type = obj.type == "入室" ? RoomAccessType.ENTRY : RoomAccessType.EXIT;
    return new RoomAccessData(room, member, type);
  }

  isSafe() {
    const isAccessed = this.room.inmates.some((inmate, index) => {
      return inmate.id == this.member.id
        && inmate.discord.id == this.member.discord.id;
    });
    return (isAccessed && this.type == RoomAccessType.EXIT)
      || (!isAccessed && this.type == RoomAccessType.ENTRY);
  }

  toLog() {
    const week = WEEKS[this.timestamp.getDay()];
    return [
      "",
      this.member.id,
      this.member.name,
      this.room.campus,
      this.type,
      Utilities.formatDate(this.timestamp, "Asia/Tokyo", Utilities.formatString("dd日(%s)", week)),
      Utilities.formatDate(this.timestamp, "Asia/Tokyo", "HH:mm")
    ];
  }
}