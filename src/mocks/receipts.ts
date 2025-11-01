import { TransactionStatus } from "./history";

export interface Receipt {
  code: string;
  txHash: string;
  from: string;
  to: string;
  usd: number;
  mxn: number;
  status: TransactionStatus;
  expiresAt: string;
  createdAt: string;
}

export const mockReceipts: Record<string, Receipt> = {
  "ABC123": {
    code: "ABC123",
    txHash: "0xfake1234567890abcdef",
    from: "juan.eth",
    to: "mama@email.com",
    usd: 100,
    mxn: 1732.5,
    status: "confirmed",
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
  },
};

export const generateReceipt = (from: string, to: string, usd: number, mxn: number): Receipt => {
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  const txHash = "0x" + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
  
  return {
    code,
    txHash,
    from,
    to,
    usd,
    mxn,
    status: "confirmed",
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
  };
};
