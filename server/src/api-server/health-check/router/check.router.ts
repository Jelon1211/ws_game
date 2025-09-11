import {Router, Request, Response, NextFunction} from "express";
import {Routes} from "../../main-router/routes.enum";
import {HttpException} from "../../../exceptions/http.exception";

export class CheckRouter {
  private readonly checkRouter = Router();

  constructor() {
    this.checkRouter.get(
      `${Routes.V1}${Routes.CHECK}${Routes.PING}`,
      (_req: Request, res: Response) => {
        res.status(200).send("pong");
      }
    );

    this.checkRouter.get(
      `${Routes.V1}${Routes.CHECK}${Routes.TELEMETRY}`,
      async (
        _req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> => {
        try {
          res.status(200);
        } catch (err) {
          const error = new HttpException("Internal server error", 500, {
            cause: err,
          });
          next(error);
        }
      }
    );
  }

  public get router(): Router {
    return this.checkRouter;
  }
}
