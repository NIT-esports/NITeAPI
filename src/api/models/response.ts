import { DTO } from "./dto";

enum ResultState {
    SUCCESS = "Success",
    FAILED = "Failed"
}

export class Response {
  readonly state: ResultState;
  readonly message: string;
  readonly data: DTO
  
  constructor(state: ResultState, message: string, data: DTO) {
    this.state = state;
    this.message = message;
    this.data = data;
  }

  static Success(response: DTO): Response {
    return new Response(ResultState.SUCCESS, "", response);
  }

  static Failed(message: string): Response {
    return new Response(ResultState.FAILED, message, null);
  }
}