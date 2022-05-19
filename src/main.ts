import { Cache } from "./api/caches";
import { Member, Room } from "./api/models/responses";
import { Route } from "./api/routes";

function doEvery6Hours() {
  Cache.make<Member>(Member);
  Cache.make<Room>(Room);
}

function toJson(data: any) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e: any) {
  const endpoint = Route.get(e.pathInfo);
  if(endpoint) {
    const query = e.parameter;
    const response = endpoint.execute(query);
    return toJson(response);
  }
  return toJson(null);
}

function doPost(e: any) {
  const endpoint = Route.get(e.pathInfo);
  if(endpoint) {
    const query = e.parameter;
    const postdata = JSON.parse(e.postData?.contents || "null");
    const response = endpoint.execute(query, postdata);
    return toJson(response);
  }
  return toJson(null);
}