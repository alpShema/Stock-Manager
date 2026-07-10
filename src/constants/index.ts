export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8087/api/v1";

export const DEBT_STATUSES = ["PENDING", "PARTIALLY_PAID", "PAID"] as const;
export const CURRENCIES = ["USD", "FRANCS"] as const;
export const ROLES = ["USER", "ADMIN", "SUPER_ADMIN"] as const;
export const TILL_TRANSACTION_TYPES = [
  "SALE_INCOME",
  "EXPENSE",
  "TILL_TO_BANK",
  "FRANC_TO_USD_CONVERSION",
  "USD_TO_FRANC_CONVERSION",
] as const;

export const DEFAULT_PAGE_SIZE = 10;
