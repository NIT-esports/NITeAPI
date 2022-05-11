import { Response } from "./response";

enum ResultState {
    SUCCESS = "Success",
    FAILED = "Failed"
}

export class APIResponse {
  readonly state: ResultState;
  readonly message: string;
  readonly data: Response;
  
  constructor(state: ResultState, message: string, data: Response) {
    this.state = state;
    this.message = message;
    this.data = data;
  }

  static Success(response: Response): APIResponse {
    return new APIResponse(ResultState.SUCCESS, "", response);
  }

  static Failed(message: string): APIResponse {
    return new APIResponse(ResultState.FAILED, message, null);
  }
}