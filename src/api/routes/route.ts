import { Endpoint } from "./models";
import { MemberController, RoomController } from "./controllers";

export class Route {
    private static readonly _routes: Endpoint[] = [
        new MemberController.Index(),
        new MemberController.Update(),
        new MemberController.Register(),
        new RoomController.Index(),
        new RoomController.Entry(),
        new RoomController.Exit()
    ];

    static get(path: string): Endpoint {
        return this._routes.find((route) => {
            return route.path == path;
        });
    }
}