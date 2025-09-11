import {Express, Request, Response, NextFunction} from "express";
import {match} from "path-to-regexp";
import {AppLogger} from "../../loggers/logger-service/logger.service";
import {LoggerLevelEnum} from "../../loggers/log-level/logger-level.enum";
import {InfoLog} from "../../loggers/info-log/info-log.instance";

export class RequestLoggerMiddleware {
  private readonly logger: AppLogger = AppLogger.getInstance();

  constructor(private readonly app: Express) {}

  public init({excludedRoutes = []}: {excludedRoutes?: string[]}) {
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      const shouldExclude = excludedRoutes.some((route) => {
        const matcher = match(route, {decode: decodeURIComponent});
        return matcher(req.originalUrl);
      });

      if (shouldExclude || req.method === "OPTIONS") {
        return next();
      }

      const start = Date.now();

      res.on("finish", () => {
        const duration = Date.now() - start;

        const logData = {
          method: req.method,
          url: req.originalUrl,
          status: res.statusCode,
          duration: `${duration}ms`,
          params: req.params,
          query: req.query,
          body: req.body as unknown,
          header: req.headers,
        };

        this.logger.log(
          LoggerLevelEnum.INFO,
          new InfoLog(`Incoming request: ${JSON.stringify(logData)}`)
        );
      });

      next();
    });
  }
}
