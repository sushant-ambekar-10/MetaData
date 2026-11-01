export class AppError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.status = status;
    this.errCode = code;
    this.details = details;
  }
}