import { Endpoint } from "."
import { APIResponse } from "../../models"

export interface Get extends Endpoint {
    execute(parameter: object): APIResponse
}

export interface Post extends Endpoint {
    execute(parameter: object, postdata: object): APIResponse
}