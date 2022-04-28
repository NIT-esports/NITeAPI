class Room {
  constructor(campus) {
    const id = PropertiesService.getScriptProperties().getProperty("ROOM_SHEET_ID");
    const spreadsheet = SpreadsheetApp.openById(id);
    const range = spreadsheet.getRangeByName(campus == "小波瀬" ? "Obase" : "Kokura");
    this._sheet = range.getSheet();
    this._values = range.getValues();
    this.campus = campus;
    this.inmates = this._values.filter((value, index) => {
      return value[2];
    }).map((data, index) => {
      return new MemberData(data[0], data[1], data[2], data[3]);
    });
    console.log(this.inmates);
  }

  toJSON() {
    return {
      campus: this.campus,
      inmates: this.inmates
      /*      
      .map((inmate) => {
        return {
          id: inmate.id,
          name: inmate.name,
          discord: {
            id: inmate.discord.id,
            nickname: inmate.discord.nickname,
          }
        }
      })
      */
    };
  }

  access(accessData) {
    Log.write(accessData);
    if (accessData.type == RoomAccessType.ENTRY) {
      this.entry(accessData.member);
    } else {
      this.exit(accessData.member);
    }
  }

  entry(member) {
    this.inmates.push(member);
    this._sheet.appendRow([
      "",
      member.id,
      member.name,
      member.discord.id,
      member.discord.nickname
    ]);
  }

  exit(member) {
    const transValues = _.zip.apply(_, this._values);
    const index = transValues[0].indexOf(member.id) + 5;
    this._sheet.deleteRow(index);
    this.inmates = this.inmates.filter((inmate, i) => {
      return i != index - 5;
    })
  }
}