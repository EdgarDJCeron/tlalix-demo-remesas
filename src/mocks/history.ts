export type TransactionStatus = "pending" | "confirmed" | "withdrawn" | "failed" | "timeout";

export interface Transaction {
  id: string;
  date: string;
  usd: number;
  mxn: number;
  fee: number;
  recipient: string;
  status: TransactionStatus;
  txHash?: string;
}

export const mockHistory: Transaction[] = [
  {
    id: "1",
    date: "2025-10-28T15:30:00Z",
    usd: 100,
    mxn: 1732.5,
    fee: 1.5,
    recipient: "maria.eth",
    status: "withdrawn",
    txHash: "0xabc123...def456",
  },
  {
    id: "2",
    date: "2025-10-25T10:15:00Z",
    usd: 250,
    mxn: 4331.25,
    fee: 3.75,
    recipient: "jose@email.com",
    status: "confirmed",
    txHash: "0x789ghi...jkl012",
  },
  {
    id: "3",
    date: "2025-10-20T08:45:00Z",
    usd: 50,
    mxn: 866.25,
    fee: 0.75,
    recipient: "ana.eth",
    status: "pending",
  },
  {
    id: "4",
    date: "2025-10-15T14:20:00Z",
    usd: 300,
    mxn: 5197.5,
    fee: 4.5,
    recipient: "pedro@email.com",
    status: "failed",
  },
];
