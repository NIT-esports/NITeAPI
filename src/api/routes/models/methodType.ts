import { Endpoint } from "."
import { Response } from "../../models"

export interface Get extends Endpoint {
    execute(parameter: object): Response
}

export interface Post extends Endpoint {
    execute(parameter: object, postdata: { [key: string]: any }): Response
}