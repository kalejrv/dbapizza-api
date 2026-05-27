export enum ServerStatusMessage {
  OK = "OK",
  FAILED = "FAILED",
  CREATED = "CREATED",
  UPDATED = "UPDATED",
  DELETED = "DELETED",
  BAD_REQUEST = "BAD_REQUEST",
  CONFLICT = "CONFLICT",
  NOT_FOUND = "NOT_FOUND",
  UNAUTHORIZED = "UNAUTHORIZED",
};

export type APIResponse = {
  status: ServerStatusMessage;
  msg?: string;
  data?: unknown;
};
