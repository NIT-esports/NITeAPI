import { Request } from "./request";

export class AccessRequest extends Request<AccessRequest> {
    id: string;
    place: { campus: string, name: string }
}