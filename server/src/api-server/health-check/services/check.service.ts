import {Status, Telemetry} from "../interfaces";
import {HealthCheckModel} from "../../../data-sources/sql/models/health-check.model";

export class CheckService {
  public async getTelemetry(): Promise<Telemetry> {
    // eslint-disable-next-line init-declarations
    let postgres: Status;

    try {
      await HealthCheckModel.healthQueryQuery();
      postgres = Status.OK;
    } catch (err) {
      postgres = Status.ERROR;
    }

    return {
      postgres,
    };
  }
}
