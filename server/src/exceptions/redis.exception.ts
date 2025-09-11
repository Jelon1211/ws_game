import {CustomException} from "./custom-exception.interface";
import {ExceptionCodeEnum} from "./exception-code.enum";

export class RedisException extends Error implements CustomException {
  readonly name = "REDIS EXCEPTION";
  readonly cause: unknown;
  alreadyLogged: boolean = false;

  constructor(
    readonly message: string,
    readonly errorCode: ExceptionCodeEnum,
    options?: {cause: unknown}
  ) {
    super(message, {
      cause: options?.cause,
    });
    this.cause = options?.cause;
  }
}
