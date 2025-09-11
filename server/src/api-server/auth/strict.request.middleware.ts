import {Express, Request, Response, NextFunction} from "express";
import {HttpException} from "../../exceptions/http.exception";
import {match} from "path-to-regexp";

export class StrictRequestMiddleware {
  private readonly allowedMethods = new Set(["POST"]);
  private readonly allowedHeaders = new Set([
    "content-type",
    "authorization",
    "x-requested-with",
    "origin",
    "accept",
    "user-agent",
    "cache-control",
    "postman-token",
    "host",
    "connection",
    "traceparent",
    "roblox-id",
    "accept-encoding",
    "content-length",
    "x-platform-token",
  ]);

  constructor(private readonly app: Express) {}

  public init({excludedRoutes = []}: {excludedRoutes?: string[]}) {
    this.app.use((req: Request, _res: Response, next: NextFunction) => {
      const isExcluded = excludedRoutes.some((route) => {
        const matcher = match(route, {decode: decodeURIComponent});
        return matcher(req.originalUrl);
      });

      if (isExcluded) {
        return next();
      }

      if (!this.allowedMethods.has(req.method)) {
        return next(new HttpException(`Method ${req.method} Not Allowed`, 405));
      }

      const incomingHeaders = Object.keys(req.headers);
      for (const header of incomingHeaders) {
        if (!this.allowedHeaders.has(header.toLowerCase())) {
          return next(
            new HttpException(`Header "${header}" is not allowed`, 400)
          );
        }
      }

      next();
    });
  }
}
