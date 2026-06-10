import { Order } from "@types";

export interface SalesGrowthRateArgs {
  currentMonthItems: Order[];
  lastMonthItems: Order[];
};

export interface SalesGrowthRate {
  currentMonthSalesAmount: number;
  lastMonthSalesAmount: number;
  salesGrowthRate: number | null;
};
