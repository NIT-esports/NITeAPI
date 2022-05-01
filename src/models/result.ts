export class Result {
  state: string;
  message: string;
  
  constructor(state: string, message: string) {
    this.state = state;
    this.message = message;
  }
}