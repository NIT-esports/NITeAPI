import { Discord } from ".";

export class Member {
  id: number;
  name: string;
  discord: Discord;
  
  constructor(id: number, name: string, discord: Discord) {
    this.id = id;
    this.name = name;
    this.discord = discord;
  }
}