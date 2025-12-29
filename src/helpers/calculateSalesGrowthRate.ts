import { SalesGrowthRate, SalesGrowthRateProps } from "@types";

export const calculateSalesGrowthRate = ({ currentMonthItems, lastMonthItems }: SalesGrowthRateProps): SalesGrowthRate => {
  const currentMonthSalesAmount = currentMonthItems.reduce((prev, curr): number => prev += curr.total, 0);
  const lastMonthSalesAmount = lastMonthItems.reduce((prev, curr): number => prev += curr.total, 0);
  let salesGrowthRate: number | null = null;
  
  if (lastMonthSalesAmount > 0) {
    salesGrowthRate = ((currentMonthSalesAmount - lastMonthSalesAmount) / lastMonthSalesAmount) * 100;
    salesGrowthRate = Number(salesGrowthRate.toFixed(2));
  } else if (currentMonthSalesAmount > 0) {
    salesGrowthRate = 100;
  };

  return {
    currentMonthSalesAmount,
    lastMonthSalesAmount,
    salesGrowthRate,
  };
};
