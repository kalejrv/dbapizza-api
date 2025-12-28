export interface ItemsGrowthRateArgs { 
  currentMonthItemsCount: number;
  lastMonthItemsCount: number;
};

export interface ItemsGrowthRate extends ItemsGrowthRateArgs {
  itemsGrowthRate: number | null;
};
