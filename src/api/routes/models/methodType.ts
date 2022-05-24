import { Endpoint } from "."
import { Error, Response } from "../../models/responses"

export interface Get<Success extends Response<Success>> extends Endpoint<Success> {
    execute(parameter: object): Success | Success[] | Error
}

export interface Post<Success extends Response<Success>> extends Endpoint<Success> {
    execute(parameter: object, postdata: object): Success | Success[] | Error
}