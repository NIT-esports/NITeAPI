import { Result } from "../../models"

export interface Endpoint {
    path: string;
    execute(query: { [key: string]: any }, postdata?: { [key: string]: any }): Result
}