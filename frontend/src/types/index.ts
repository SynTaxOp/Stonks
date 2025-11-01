// Type definitions for the application

export interface UserDashboardDTO {
  userID: string;
  userName: string;
  fundSummaries: FundSummaryDTO[];
  totalInvested: number;
  totalValue: number;
  profitLoss: number;
  profitLossPercent: number;
  totalEmergencyFundValue: number;
}

export interface UserDashboardExtraDTO {
  xirr: number;
  totalRealizedProfit: number;
  currentYearTotalRealizedProfit: number;
  longTermGains: number;
}

export interface MutualFundDTO {
  schemeCode: number;
  schemeName: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface User {
  id: string;
  name: string;
  loginId: string;
  password: string;
}

export interface UserDTO {
  id?: string;
  name: string;
  loginId: string;
  password: string;
}

export interface Transaction {
  id: string;
  fundName: string;
  fundId: number;
  amount: number;
  date: number;
  userId: string;
  price?: number;
  units?: number;
  transactionType: string;
}

export interface TransactionDTO {
  id?: string;
  fundName: string;
  fundId: number;
  amount: number;
  date: number;
  userId: string;
  price?: number;
  units?: number;
  transactionType: string;
}

export interface UserFundDTO {
  userId: string;
  fundId: number;
  fundName: string;
  isEmergency: boolean;
  tag?: string;
}

export interface UnitsDTO {
  date: number;
  amount: number;
  units: number;
  profitLoss?: number;
  profitLossPercent?: number;
  TransactionType?: string;
  isSold?: boolean;
  sellDate?: string;
}

export interface FundSummaryDTO {
  name: string;
  fundId: number;
  tag?: string;
  isEmergency: boolean;
  totalInvested: number;
  totalValue: number;
  totalUnits: number;
  profitLoss: number;
  profitLossPercent: number;
}

export interface FundSummaryExtraDTO {
  xirr: number;
  totalRealizedProfit: number;
  currentYearTotalRealizedProfit: number;
  longTermGains: number;
}

export interface SIPDTO {
  id: string;
  fundName: string;
  fundId: number;
  userId: string;
  amount: number;
}

export interface UserFundDetailsDTO {
  userFundDTO: UserFundDTO;
  units: UnitsDTO[];
  summary: FundSummaryDTO;
  extraSummary: FundSummaryExtraDTO;
  registeredSIPs: SIPDTO[];
}
