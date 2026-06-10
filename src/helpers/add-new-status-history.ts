import { OrderStatusHistory, Status } from "@types";

export const addNewStatusHistory = (newStatus: Status): OrderStatusHistory => {
  const newDate = new Date();
  const year = newDate.getFullYear();
  const month = newDate.getMonth();
  const date = newDate.getDate();
  const hours = newDate.getHours();
  const minutes = newDate.getMinutes();
  const seconds = newDate.getSeconds();
  
  return {
    name: newStatus.name,
    timestamp: new Date(Date.UTC(year, month, date, hours, minutes, seconds)),
  };
};
