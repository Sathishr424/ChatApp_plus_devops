interface ErrorExceptionInterface {
  message: String;
  statusCode: number;
}

export class ErrorException extends Error implements ErrorExceptionInterface {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

