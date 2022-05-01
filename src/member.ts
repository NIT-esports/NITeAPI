class Member {
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
}