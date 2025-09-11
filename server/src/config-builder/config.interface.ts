import {PoolConfig} from "pg";

interface ExpressApi {
  bind: string;
  port: number;
  authorizationToken: string;
  passphrase: string;
  pathKey: string;
  pathCert: string;
}

interface Luxon {
  timezone: string;
}

interface WinstonConsole {
  level: string;
  handleExceptions: boolean;
  json: boolean;
  colorize: boolean;
}

interface WinstonSentry {
  level: string;
}

interface WinstonTransports {
  console: {
    enabled: boolean;
  };
  sentry: {
    enabled: boolean;
  };
}

interface Winston {
  console: WinstonConsole;
  sentry: WinstonSentry;
  transports: WinstonTransports;
  exitOnError: boolean;
}

export interface ConfigSentry {
  tracing: {
    enabled: boolean;
    tracesSampleRate: number;
    stripedTransactionTagList: string[];
    skipTransactionEventList: string[];
  };
  dsn: string;
  environment: string;
  release: string;
}

export enum ConnectionTypeId {
  READ = "READ",
  WRITE = "WRITE",
}

export interface ConfiguredPool {
  id: ConnectionTypeId;
  connection: PoolConfig;
}

interface Notify {
  address: string;
  route: string;
  alg: string;
  token: string;
}

interface Cron {
  test: string;
}

interface TimeInterval {
  refund: number;
  abandonedTransaction: number;
}

export interface Config {
  application: string;
  expressApi: ExpressApi;
  luxon: Luxon;
  winston: Winston;
  sentry: ConfigSentry;
  postgresRead: ConfiguredPool;
  postgresWrite: ConfiguredPool;
  notificationConsumer: Notify;
  cron: Cron;
  timeInterval: TimeInterval;
  redis: RedisConnection;
  secret: Secret;
  allowedOrigins: string[];
}

interface Secret {
  jwt: string;
}

interface RedisConnection {
  connection: {
    host: string;
    port: number;
  };
}

export interface User {
  sub: string;
  role: string;
  platform: string;
}
