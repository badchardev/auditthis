import { IncomeEntry, ExpenseEntry } from '../types';

export const formatCurrency = (amount: number, currency = '$'): string => {
  return `${currency} ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const calculateTotalIncome = (entries: IncomeEntry[]): number => {
  return entries.reduce((sum, entry) => sum + entry.netIncome, 0);
};

export const calculateTotalExpenses = (entries: ExpenseEntry[]): number => {
  return entries.reduce((sum, entry) => sum + entry.netExpense, 0);
};

export const calculateProfit = (income: number, expenses: number): number => {
  return income - expenses;
};

export const calculateProfitMargin = (profit: number, income: number): number => {
  return income > 0 ? (profit / income) * 100 : 0;
};

export const getMonthName = (monthIndex: number): string => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  return months[monthIndex];
};

export const getMonthYear = (date: Date): string => {
  return `${getMonthName(date.getMonth())} ${date.getFullYear()}`;
};

export const filterEntriesByMonth = <T extends { date: string }>(
  entries: T[],
  year: number,
  month: number
): T[] => {
  return entries.filter(entry => {
    const entryDate = new Date(entry.date);
    return entryDate.getFullYear() === year && entryDate.getMonth() === month;
  });
};