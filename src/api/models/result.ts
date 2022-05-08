import { Response, ResultState } from ".";

export class Result {
  readonly state: ResultState;
  readonly message: string;
  readonly data: Response
  
  constructor(state: ResultState, message: string, data: Response) {
    this.state = state;
    this.message = message;
    this.data = data;
  }

  static Success(response: Response): Result {
    return new Result(ResultState.SUCCESS, "", response);
  }

  static Failed(message: string): Result {
    return new Result(ResultState.FAILED, message, null);
  }
}