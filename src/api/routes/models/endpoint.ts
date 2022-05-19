import { APIResponse } from "../../models";

export interface Endpoint {
    path: string;
    execute(parameter: object, postdata?: object): APIResponse
}