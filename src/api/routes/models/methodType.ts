import { Endpoint } from "."
import { Result } from "../../models"

export interface Get extends Endpoint {
    execute(query: { [key: string]: any }): Result
}

export interface Post extends Endpoint {
    execute(query: { [key: string]: any }, postdata: { [key: string]: any }): Result
}