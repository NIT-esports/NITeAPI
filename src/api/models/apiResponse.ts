import { Response } from "./responses/response";

enum ResultState {
    SUCCESS = "Success",
    FAILED = "Failed"
}

export class APIResponse {
  readonly state: ResultState;
  readonly message: string;
  readonly data: Response<any> | Response<any>[];
  
  constructor(state: ResultState, message: string, data: Response<any> | Response<any>[]) {
    this.state = state;
    this.message = message;
    this.data = data;
  }

  static Success(response: Response<any> | Response<any>[]): APIResponse {
    return new APIResponse(ResultState.SUCCESS, "", response);
  }

  static Failed(message: string): APIResponse {
    return new APIResponse(ResultState.FAILED, message, null);
  }
}