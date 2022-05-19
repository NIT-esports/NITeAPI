import { DTO } from "..";

export class AccessRequest extends DTO<AccessRequest> {
    id: string;
    place: { campus: string, name: string }
}