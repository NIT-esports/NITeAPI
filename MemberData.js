class MemberData {
  constructor(member, discord, games) {
    this.id = Number(member[0]);
    this.name = member[1];
    this.role = member[2];
    this.discord = new DiscordData(discord);
    this.games = [];
    for(const key in games) {
      this.games.push(new Game(key, games[key]));
    }
  }
}