import { OrderCode, OrderCodeProps } from "@types";

export const createOrderCode = ({ firstName, lastName }: OrderCodeProps): OrderCode => {
  const prefix: string = "ORD";
  const userName: string = `${firstName.slice(0, 1).toUpperCase()}${lastName.slice(0, 1).toUpperCase()}`;
  const randomNumber: number = Math.floor((Math.random()) * 100000);

  return `${prefix}-${userName}-${randomNumber}`;
};
