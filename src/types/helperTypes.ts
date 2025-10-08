import { Order } from "./orderTypes";

/* Calculate items growth rate. */
export interface ItemsGrowthRateProps { 
  currentMonthItemsCount: number;
  lastMonthItemsCount: number;
};
export interface ItemsGrowthRate extends ItemsGrowthRateProps {
  itemsGrowthRate: number | null;
};

/* Calculate sales growth rate. */
export interface SalesRateProps {
  currentMonthItems: Order[];
  lastMonthItems: Order[];
};
export interface SalesRate {
  currentMonthSalesAmount: number;
  lastMonthSalesAmount: number;
  salesGrowthRate: number | null;
};
