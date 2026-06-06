export interface Business {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  currentCost: number;
  level: number;
  hourlyIncomePerLevel: number;
  iconName: string;
}

export interface CryptoAsset {
  id: string;
  name: string;
  symbol: string;
  currentPrice: number;
  amountOwned: number;
  priceHistory: number[]; // For drawing a chart
  changePct: number;
  color: string;
}

export interface StockAsset {
  id: string;
  name: string;
  symbol: string;
  currentPrice: number;
  amountOwned: number;
  priceHistory: number[];
  changePct: number;
  color: string;
}

export interface RealEstateAsset {
  id: string;
  name: string;
  currentPrice: number;
  amountOwned: number;
  rentIncomePerHour: number;
  priceHistory: number[];
  changePct: number;
  color: string;
}

export interface LuxuryAsset {
  id: string;
  name: string;
  category: "hangar" | "garaj" | "liman" | "tablo" | "konak";
  cost: number;
  purchased: boolean;
  imagePlaceholder: string;
  description: string;
  boostMultiplier: number; // e.g. +5% passive income boost
}

export interface NewsEvent {
  id: string;
  headline: string;
  targetSymbol: string;
  assetType: "crypto" | "stock";
  changePct: number;
  isPositive: boolean;
  timeLabel: string;
}

export interface DailyGoal {
  id: string;
  title: string;
  description: string;
  targetType: "clicks" | "wealth" | "businesses" | "crypto" | "estate";
  targetValue: number;
  reward: number;
  completed: boolean;
  claimed: boolean;
}

export interface GameState {
  balance: number;
  clickLevel: number;
  clickIncome: number;
  clickUpgradeCost: number;
  businesses: Business[];
  cryptoAssets: CryptoAsset[];
  stocks: StockAsset[];
  realEstates: RealEstateAsset[];
  luxuryAssets: LuxuryAsset[];
  adBoostTimeLeft: number; // in seconds
  passiveBoostMultiplier: number; // e.g. 1.0 (increased by watching ads or luxury assets)
  totalClicks: number;
  totalEarnedCash: number;
  totalStatsTime: number; // in seconds
}
