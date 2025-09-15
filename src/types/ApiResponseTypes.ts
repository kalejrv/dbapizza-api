export enum ServerStatusMessage {
  OK = "OK",
  FAILED = "FAILED",
  CREATED = "CREATED",
  BAD_REQUEST = "BAD_REQUEST",
  NOT_FOUND = "NOT_FOUND",
  UNAUTHORIZED = "UNAUTHORIZED",
};

export type APIResponse = Record<string, unknown>;
