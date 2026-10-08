export const REFERRAL_FEE_RATE = 0.08;
export const PAYOUT_HOLD_DAYS = 7;
export const MINIMUM_PAYOUT = 25;

export type PayoutEstimate = {
  sale: number;
  fee: number;
  payout: number;
};

function money(value: number) {
  return Math.round(value * 100) / 100;
}

export function formatTaka(value: number) {
  const formatted = new Intl.NumberFormat("en-BD", {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);

  return `Tk ${formatted}`;
}

export function estimatePayout(sale: number): PayoutEstimate {
  const amount = money(Math.max(0, sale));
  const fee = money(amount * REFERRAL_FEE_RATE);

  return {
    sale: amount,
    fee,
    payout: money(amount - fee),
  };
}
