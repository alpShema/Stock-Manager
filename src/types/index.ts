// Shared response envelope from the backend
export interface ApiResponse<T> {
  message: string;
  data: T;
}

// Spring Page wrapper
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// ---- Enums ----
export type Role = "USER" | "ADMIN" | "SUPER_ADMIN";
export type Currency = "USD" | "FRANCS";
export type DebtStatus = "PENDING" | "PARTIALLY_PAID" | "PAID";
export type TillTransactionType =
  | "SALE_INCOME"
  | "EXPENSE"
  | "TILL_TO_BANK"
  | "FRANC_TO_USD_CONVERSION"
  | "USD_TO_FRANC_CONVERSION";
export type AuditAction = "ADD" | "UPDATE" | "DELETE";

// ---- User ----
export interface ViewUserDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: Role;
  createdAt: string;
}

// ---- Stock ----
export interface ViewStockDto {
  id: string;
  code: string;
  name: string;
  containerName: string;
  quantity: number;
  weight: string;
  price: number;
  recordedBy: string;
  createdAt: string;
  lastUpdatedBy: string | null;
  lastUpdatedAt: string | null;
}

// ---- Sales ----
export interface ViewSaleDto {
  id: string;
  date: string;
  code: string;
  name: string;
  quantity: number;
  price: number;
  totalPrice: number;
  weight: string;
  containerName: string;
  recordedBy: string;
}

// ---- Till ----
export interface ViewTillTransactionDto {
  id: string;
  type: TillTransactionType;
  amount: number;
  currency: Currency;
  description: string | null;
  recordedBy: string;
  transactionDate: string;
}

// ---- Expense ----
export interface ViewExpenseDto {
  id: string;
  description: string;
  amount: number;
  currency: Currency;
  recordedBy: string;
  expenseDate: string;
}

// ---- Debt ----
export interface ViewDebtDto {
  id: string;
  customerName: string;
  amount: number;
  date: string;
  recordedBy: string;
  lastUpdatedAt: string | null;
  lastUpdatedBy: string | null;
}

// ---- Advance ----
export interface ViewAdvanceDto {
  id: string;
  customerName: string;
  amount: number;
  date: string;
  recordedBy: string;
  lastUpdatedAt: string | null;
  lastUpdatedBy: string | null;
}

export interface AdvanceSummaryDto {
  customerName: string;
  amount: number;
}

// ---- Audit ----
export interface AuditTrailDto {
  action: AuditAction;
  performedBy: string;
  performedAt: string;
  details: string;
}

export interface StockAuditDto extends AuditTrailDto {
  id: string;
  stockId: string;
}
