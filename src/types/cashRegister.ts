export type CashRegister = {
  openingAmount: number;
  closingAmount?: number;
  expectedAmount?: number;
  difference?: number;

  cashSales: number;
  yapeSales: number;
  plinSales: number;
  cardSales: number;
  totalSales: number;

  status: "open" | "closed";
  openedBy: string;
  closedBy?: string;
};