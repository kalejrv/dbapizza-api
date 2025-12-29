import { ItemsGrowthRate, ItemsGrowthRateArgs } from "@types";

export const calculateItemsGrowthRate = (itemsGrowthRateArgs: ItemsGrowthRateArgs): ItemsGrowthRate => {
  const { currentMonthItemsCount, lastMonthItemsCount } = itemsGrowthRateArgs;

  let itemsGrowthRate: number | null = null;
  
  if (lastMonthItemsCount > 0) {
    itemsGrowthRate = ((currentMonthItemsCount - lastMonthItemsCount) / lastMonthItemsCount) * 100;
    itemsGrowthRate = Number(itemsGrowthRate.toFixed(2));
  } else if (currentMonthItemsCount > 0) {
    itemsGrowthRate = 100;
  };
  
  return {
    currentMonthItemsCount,
    lastMonthItemsCount,
    itemsGrowthRate,
  };
};
