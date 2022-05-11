import { DTO } from "..";

export abstract class Response<T> extends DTO<T> {
    abstract toJSON(): object
}