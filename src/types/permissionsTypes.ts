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
  method: string;
  scope: string;
  permissions: string[];
};

export const permissions: Permission[] = [
  {
    method: Method.GET,
    scope: Scope.Read,
    permissions: ["admin_granted"],
  },
  {
    method: Method.POST,
    scope: Scope.Write,
    permissions: ["admin_granted"],
  },
  {
    method: Method.PATCH,
    scope: Scope.Update,
    permissions: ["admin_granted"],
  },
  {
    method: Method.DELETE,
    scope: Scope.Delete,
    permissions: ["admin_granted"],
  },
];
