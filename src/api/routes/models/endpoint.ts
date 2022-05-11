import { Response } from "../../models";

export interface Endpoint {
    path: string;
    execute(parameter: object, postdata?: { [key: string]: any }): Response
}