class MemberData {
  constructor(id, name, discordID, discordName) {
    this.id = id;
    this.name = name;
    this.discord = { id: discordID, nickname: discordName };
  }
}