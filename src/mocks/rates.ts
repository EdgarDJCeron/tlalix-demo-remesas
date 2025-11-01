export const currentRates = {
  usdToMxn: 17.50,
  feePct: 0.015, // 1.5%
  updatedAt: "2025-11-01T00:00:00Z",
};

export const convertUsdToMxn = (usd: number): number => {
  return Number((usd * currentRates.usdToMxn).toFixed(2));
};

export const calculateFee = (usd: number): number => {
  return Number((usd * currentRates.feePct).toFixed(2));
};

export const calculateTotal = (usd: number): { mxn: number; fee: number; total: number } => {
  const fee = calculateFee(usd);
  const mxn = convertUsdToMxn(usd - fee);
  return {
    mxn,
    fee,
    total: usd - fee,
  };
};
