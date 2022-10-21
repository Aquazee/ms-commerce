export interface IError {
  status: number;
  fields: {
    name: {
      message: string;
    };
  };
  message: string;
  error: string;
}

class ApiError extends Error implements IError {
  public error: string;

  public status = 500;

  public success = false;

  public fields: { name: { message: string } };

  constructor(msg: string, statusCode?: number, name: string = 'ApiError') {
    super();
    this.status = statusCode || this.status;
    this.error = name;
    this.message = msg;
  }
}

export default ApiError;
