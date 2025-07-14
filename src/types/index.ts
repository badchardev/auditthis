export interface IncomeStream {
  id: string;
  name: string;
  isActive: boolean;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  isActive: boolean;
}

export interface IncomeEntry {
  id: string;
  date: string;
  category: string;
  totalIncome: number;
  salesTax: number;
  netIncome: number;
  notes?: string;
  reconciliation?: ReconciliationStatus;
}

export interface ExpenseEntry {
  id: string;
  date: string;
  category: string;
  vendor?: string;
  totalExpense: number;
  tax: number;
  netExpense: number;
  notes?: string;
  reconciliation?: ReconciliationStatus;
}

export interface AppSettings {
  currency: string;
  startDate: string;
  lastReconciliationDate?: string;
  openingBalance?: number;
  incomeStreams: IncomeStream[];
  expenseCategories: ExpenseCategory[];
  vendors: Vendor[];
}

export interface Vendor {
  id: string;
  name: string;
  isActive: boolean;
}

export interface AppData {
  settings: AppSettings;
  income: IncomeEntry[];
  expenses: ExpenseEntry[];
}

export interface Company {
  id: string;
  name: string;
  createdAt: string;
  isActive: boolean;
}

export interface CompanyData {
  company: Company;
  data: AppData;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface SplitTransaction {
  id: string;
  category: string;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  businessName: string;
  businessAddress: string;
  businessEmail: string;
  businessPhone: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  notes: string;
}

export interface ReconciliationStatus {
  isReconciled: boolean;
  reconciledDate?: string;
  clearedDate?: string;
  bankReference?: string;
  notes?: string;
}

export interface BankTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'debit' | 'credit';
  balance?: number;
  reference?: string;
  isReconciled: boolean;
  matchedTransactionId?: string;
  matchedTransactionType?: 'income' | 'expense';
}

export interface ReconciliationMatch {
  bankTransactionId: string;
  appTransactionId: string;
  appTransactionType: 'income' | 'expense';
  matchType: 'automatic' | 'manual';
  confidence: number;
}

export interface ReconciliationSummary {
  totalBankTransactions: number;
  totalAppTransactions: number;
  matchedTransactions: number;
  unmatchedBankTransactions: number;
  unmatchedAppTransactions: number;
  discrepancies: number;
}