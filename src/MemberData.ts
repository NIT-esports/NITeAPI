class MemberData {
  readonly id: number;
  readonly name: string;
  readonly discord: DiscordData;
  readonly games: Game[]

  constructor(id: number, name: string, discord: DiscordData, games: Game[]) {
    this.id = id;
    this.name = name;
    this.discord = discord;
    this.games = games;
  }
}