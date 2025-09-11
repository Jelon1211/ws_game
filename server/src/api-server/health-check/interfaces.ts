export enum Status {
  OK = "OK",
  ERROR = "ERROR",
}

export interface Telemetry {
  postgres: Status;
}
