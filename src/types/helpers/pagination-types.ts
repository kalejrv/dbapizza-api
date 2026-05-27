export interface Pagination {
  totalPages: number;
  totalItems: number;
  items: any[];
  itemsByPage: number;
  currentPage: number;
  currentItemsQuantity: number;
};

export enum PaginationModel {
  Users = "users",
  Toppings = "toppings",
  Pizzas = "pizzas",
  Orders = "orders",
};

export interface PaginationArgs {
  model: PaginationModel;
  page: number;
  limit: number;
  skip: number;
};

export interface QueryModel<T> {
  totalModelItems: number;
  modelItems: T[];
};
