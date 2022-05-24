import { Error, Response } from "../../models/responses";

export interface Endpoint<Success extends Response<Success>> {
    path: string;
    execute(parameter: object, postdata?: object): Success | Success[] | Error
}