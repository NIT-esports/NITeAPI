class MemberData {
  id: number;
  name: string;
  discord: { id: string; nickname: string; };
  
  constructor(id: number, name: string, discordID: string, discordName: string) {
    this.id = id;
    this.name = name;
    this.discord = { id: discordID, nickname: discordName };
  }
}