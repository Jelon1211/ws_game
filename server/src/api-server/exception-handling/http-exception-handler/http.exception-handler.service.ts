import {Express, NextFunction, Request, Response} from "express";
import {HttpException} from "../../../exceptions/http.exception";

export class HttpExceptionHandlerService {
  constructor(private readonly app: Express) {}

  public init(): void {
    this.app.use(
      (
        error: Error,
        _req: Request,
        res: Response,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _next: NextFunction
      ): void => {
        console.log("tutaj error", error);
        if (error instanceof HttpException) {
          res.status(error.httpCode).json({
            ok: false,
            error: {
              message: error.message,
              code: error.httpCode,
            },
          });
        }
      }
    );
  }
}
