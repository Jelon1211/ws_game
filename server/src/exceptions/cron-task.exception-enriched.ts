import {ExceptionCodeEnum} from "./exception-code.enum";
import {CronTaskException} from "./cron-task.exception";
import {CronErrorType} from "./cron-error-type.enum";

export class CronTaskExceptionEnriched extends CronTaskException {
  constructor(
    message: string,
    errorCode: ExceptionCodeEnum,
    readonly cronErrorType: CronErrorType,
    options?: {cause: unknown}
  ) {
    super(message, errorCode, {
      cause: options?.cause,
    });
  }
}
