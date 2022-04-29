function makeCache() {
  Cache.make();
}

function toJson(data: any) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e: any) {
  const params = e.parameter;
  if (!params.id) {
    return toJson(null);
  }
  const data = MembersList.tryFind(params.id);
  return toJson(data);
}

function doPost(e: any) {
  const postdata = JSON.parse(e.postData.contents);
  if (postdata.id && postdata.nickname) {
    if (MembersList.isRegistedById(postdata.id)) {
      MembersList.update(new Discord(postdata.id, postdata.nickname));
    } else {
      const discord = new Discord(postdata.id, postdata.nickname);
      const member = new Member(0, "", discord, []);
      MembersList.regist(member);
    }
  }
  return toJson(null);
}
