import { Order } from "@types";

export interface SalesGrowthRateProps {
  currentMonthItems: Order[];
  lastMonthItems: Order[];
};

export interface SalesGrowthRate {
  currentMonthSalesAmount: number;
  lastMonthSalesAmount: number;
  salesGrowthRate: number | null;
};
