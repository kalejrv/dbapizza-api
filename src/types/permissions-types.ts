export enum Method {
  GET = "GET",
  POST = "POST",
  PATCH = "PATCH",
  DELETE = "DELETE",
};

export enum Scope {
  Read = "read",
  Write = "write",
  Update = "update",
  Delete = "delete",
};

export interface Permission {
  method: Method;
  scope: Scope;
  actions: string[];
};

export const permissions: Permission[] = [
  {
    method: Method.GET,
    scope: Scope.Read,
    actions: ["admin_granted"],
  },
  {
    method: Method.POST,
    scope: Scope.Write,
    actions: ["admin_granted"],
  },
  {
    method: Method.PATCH,
    scope: Scope.Update,
    actions: ["admin_granted"],
  },
  {
    method: Method.DELETE,
    scope: Scope.Delete,
    actions: ["admin_granted"],
  },
];
