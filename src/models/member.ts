import { Discord, Game } from ".";
import { Response } from "../api/models";
import { Cacheable } from "../utils/caches";

export interface Member extends Cacheable<typeof Member> {}
export class Member implements Response, Cacheable<typeof Member> {
  readonly id: number;
  readonly name: string;
  readonly discord: Discord;
  readonly games: Game[]

  constructor(id: number, name: string, discord: Discord, games: Game[]) {
    this.id = id;
    this.name = name;
    this.discord = discord;
    this.games = games;
  }

  static fromObject(obj: any): Member {
    try {
      const discord = new Discord(obj.discord.id, obj.discord.nickname);
      const games = obj.games.map((game) => {
        return new Game(game.title, game.id);
      });
      return new Member(obj.id, obj.name, discord, games);
    } catch (e) {
      return null;
    }
  }

  toJSON(): object {
    return {
      id: this.id,
      name: this.name,
      discord: this.discord,
      games: this.games
    };
  }
}