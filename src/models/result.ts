import { Responce, ResultState } from ".";

export class Result {
  readonly state: ResultState;
  readonly message: string;
  readonly data: Responce
  
  constructor(state: ResultState, message: string, data: Responce) {
    this.state = state;
    this.message = message;
    this.data = data;
  }
}