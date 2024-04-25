// types.ts
export interface Pog {
    id: number;
    name: string;
    ticker_symbol: string;
    price: number;
    color: string;
    quantity: number;
    prevPrice: number | null;
  }