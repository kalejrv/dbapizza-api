export interface ItemsGrowthRateProps { 
  currentMonthItemsCount: number;
  lastMonthItemsCount: number;
};

export interface ItemsGrowthRate extends ItemsGrowthRateProps {
  itemsGrowthRate: number | null;
};
