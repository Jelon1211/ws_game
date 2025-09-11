import {v4} from "uuid";
import {Express, Request, Response, NextFunction} from "express";
import cors from "cors";
import {Config} from "../../config-builder/config.interface";
import ConfigBuilder from "../../config-builder/config-builder";

export class SecurityHelpers {
  private readonly config: Config = ConfigBuilder.getConfig().config;

  constructor(private readonly app: Express) {}

  public setSecureHeaders() {
    this.app.disable("x-powered-by");
    this.app.disable("etag");
    this.app.set("trust proxy", true);
  }

  public initSecureHeadersMiddleware() {
    this.app.use(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      cors({
        origin: this.config.allowedOrigins,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        allowedHeaders: [
          "Origin",
          "X-Requested-With",
          "Content-Type",
          "Accept",
          "Authorization",
        ],
      })
    );

    this.app.use((req: Request, res: Response, next: NextFunction) => {
      req.api = {requestId: v4()};

      res.header(
        "Content-Security-Policy",
        `frame-ancestors 'self' ${this.config.allowedOrigins.join(" ")}`
      );
      res.header("X-Xss-Protection", "1; mode=block");
      res.header("X-Content-Type-Options", "nosniff");
      res.header("X-Request-Id", req.api.requestId);
      res.header(
        "Strict-Transport-Security",
        "max-age=31536000; includeSubDomains"
      );

      if (req.method === "OPTIONS") {
        res.sendStatus(200);
        return;
      }

      res.set("Connection", "close");
      next();
    });
  }
}
