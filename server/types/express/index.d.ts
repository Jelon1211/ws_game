import {User} from "../../src/config-builder/config.interface";

declare global {
  namespace Express {
    export interface Request {
      api?: {requestId: string};
      user: User;
    }
  }
}
