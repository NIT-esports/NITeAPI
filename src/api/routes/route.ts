import { Endpoint } from ".";
import { User, Room, RoomEntry, RoomExit } from "./models";

export class Route {
    private static readonly _routes: Endpoint[] = [
        new User(),
        new Room(),
        new RoomEntry(),
        new RoomExit()
    ];

    static get(path: string): Endpoint {
        return this._routes.find((route) => {
            return route.path == path;
        });
    }
}