import { Discord, Game, Responce } from ".";

export class Member implements Responce {
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

  toJSON(): object {
    return {
      id: this.id,
      name: this.name,
      discord: this.discord,
      games: this.games
    };
  }
}