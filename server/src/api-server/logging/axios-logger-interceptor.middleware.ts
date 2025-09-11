import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import {AppLogger} from "../../loggers/logger-service/logger.service";
import {InfoLog} from "../../loggers/info-log/info-log.instance";
import {LoggerLevelEnum} from "../../loggers/log-level/logger-level.enum";
import {ErrorLog} from "../../loggers/error-log/error-log.instance";
import {CustomException} from "../../exceptions/custom-exception.interface";

export class AxiosLoggerInterceptor {
  private readonly logger: AppLogger = AppLogger.getInstance();

  constructor(private readonly axiosInstance: AxiosInstance = axios) {}

  public init(): void {
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig<any>) => {
        const logData = {
          method: config.method,
          url: config.url,
          headers: config.headers,
          data: config.data,
        };

        this.logger.log(
          LoggerLevelEnum.INFO,
          new InfoLog(`Outgoing axios request: ${JSON.stringify(logData)}`)
        );

        return config;
      },
      async (error) => {
        this.logger.log(LoggerLevelEnum.ERROR, new ErrorLog(error));
        return Promise.reject(error);
      }
    );

    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        const logData = {
          method: response.config.method,
          url: response.config.url,
          status: response.status,
          statusText: response.statusText,
          responseData: response.data,
        };

        this.logger.log(
          LoggerLevelEnum.INFO,
          new InfoLog(`Axios response: ${JSON.stringify(logData)}`)
        );
        return response;
      },
      (error) => {
        if (error.response) {
          const logData = {
            method: error.config?.method,
            url: error.config?.url,
            status: error.response.status,
            data: error.response.data,
          };

          this.logger.log(
            LoggerLevelEnum.ERROR,
            new InfoLog(`Axios response error: ${JSON.stringify(logData)}`)
          );
        } else {
          this.logger.log(
            LoggerLevelEnum.ERROR,
            new ErrorLog(error as CustomException)
          );
        }

        return Promise.reject(error);
      }
    );
  }
}
