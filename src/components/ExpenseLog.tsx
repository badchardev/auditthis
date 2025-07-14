import React, { useState, useMemo } from 'react';
import { ExpenseEntry, IncomeEntry, AppSettings, SplitTransaction } from '../types';
import { formatCurrency } from '../utils/calculations';
import { Plus, Trash2, Filter, X, Calendar, DollarSign, Tag, Split, Search, Edit3, TrendingDown } from 'lucide-react';

interface ExpenseLogProps {
  expenses: ExpenseEntry[];
  income: IncomeEntry[];
  settings: AppSettings;
  onExpensesChange: (expenses: ExpenseEntry[]) => void;
}

interface FilterState {
  dateFrom: string;
  dateTo: string;
  category: string;
  vendor: string;
  amountMin: string;
  amountMax: string;
  notes: string;
}

interface SplitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSplit: (splits: SplitTransaction[], totalAmount: number, tax: number, date: string) => void;
  settings: AppSettings;
  existingTransaction?: ExpenseEntry | null;
}

const SplitModal: React.FC<SplitModalProps> = ({ isOpen, onClose, onSplit, settings, existingTransaction }) => {
  const [splits, setSplits] = useState<SplitTransaction[]>([
    { id: '1', category: settings.expenseCategories[0]?.name || '', amount: 0 },
    { id: '2', category: settings.expenseCategories[0]?.name || '', amount: 0 }
  ]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [tax, setTax] = useState<number>(0);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

  React.useEffect(() => {
    if (existingTransaction) {
      setDate(existingTransaction.date);
      setTotalAmount(existingTransaction.totalExpense);
      setTax(existingTransaction.tax);
      
      setSplits([
        { 
          id: '1', 
          category: existingTransaction.category, 
          amount: existingTransaction.totalExpense, 
        },
        { 
          id: '2', 
          category: settings.expenseCategories[0]?.name || '', 
          amount: 0, 
        }
      ]);
    } else {
      setDate(new Date().toISOString().split('T')[0]);
      setTotalAmount(0);
      setTax(0);
      setSplits([
        { id: '1', category: settings.expenseCategories[0]?.name || '', amount: 0 },
        { id: '2', category: settings.expenseCategories[0]?.name || '', amount: 0 }
      ]);
    }
  }, [existingTransaction, settings.expenseCategories]);

  const splitTotal = splits.reduce((sum, split) => sum + split.amount, 0);
  const isValid = splitTotal > 0 && Math.abs(splitTotal - totalAmount) < 0.01;

  const addSplit = () => {
    setSplits([...splits, { 
      id: Date.now().toString(), 
      category: settings.expenseCategories[0]?.name || '', 
      amount: 0, 
    }]);
  };

  const removeSplit = (id: string) => {
    if (splits.length > 2) {
      setSplits(splits.filter(split => split.id !== id));
    }
  };

  const updateSplit = (id: string, field: keyof SplitTransaction, value: any) => {
    setSplits(splits.map(split => 
      split.id === id ? { ...split, [field]: value } : split
    ));
  };

  const handleSplit = () => {
    if (isValid) {
      onSplit(splits, totalAmount, tax, date);
      onClose();
      setSplits([
        { id: '1', category: settings.expenseCategories[0]?.name || '', amount: 0 },
        { id: '2', category: settings.expenseCategories[0]?.name || '', amount: 0 }
      ]);
      setTotalAmount(0);
      setTax(0);
      setDate(new Date().toISOString().split('T')[0]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-600">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {existingTransaction ? 'Split Existing Expense Transaction' : 'Split Expense Transaction'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {existingTransaction && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Splitting existing transaction:</strong> {existingTransaction.category} - {formatCurrency(existingTransaction.totalExpense, settings.currency)} from {existingTransaction.date}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Total Expense</label>
              <div className="flex items-center space-x-2">
                <span className="text-gray-500 dark:text-gray-400">{settings.currency}</span>
                <input
                  type="number"
                  value={totalAmount || ''}
                  onChange={(e) => setTotalAmount(Number(e.target.value))}
                  className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tax</label>
              <input
                type="number"
                value={tax || ''}
                onChange={(e) => setTax(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                step="0.01"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Split Details</h3>
              <button
                onClick={addSplit}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Split</span>
              </button>
            </div>

            <div className="space-y-4">
              {splits.map((split, index) => (
                <div key={split.id} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Expense Category
                      </label>
                      <select
                        value={split.category}
                        onChange={(e) => updateSplit(split.id, 'category', e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        {settings.expenseCategories.map(category => (
                          <option key={category.id} value={category.name}>{category.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Amount
                      </label>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500 dark:text-gray-400">{settings.currency}</span>
                        <input
                          type="number"
                          value={split.amount || ''}
                          onChange={(e) => updateSplit(split.id, 'amount', Number(e.target.value))}
                          className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          step="0.01"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={() => removeSplit(split.id)}
                        disabled={splits.length <= 2}
                        className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">Split Total:</span>
                <span className={`font-semibold ${isValid ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(splitTotal, settings.currency)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm mt-1">
                <span className="text-gray-600 dark:text-gray-400">Expected Total:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(totalAmount, settings.currency)}
                </span>
              </div>
              {!isValid && splitTotal > 0 && (
                <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                  Difference: {formatCurrency(Math.abs(splitTotal - totalAmount), settings.currency)}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-600 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSplit}
            disabled={!isValid}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Split Entries
          </button>
        </div>
      </div>
    </div>
  );
};

const ExpenseLog: React.FC<ExpenseLogProps> = ({ expenses, income, settings, onExpensesChange }) => {
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newExpense, setNewExpense] = useState<Partial<ExpenseEntry>>({
    date: new Date().toISOString().split('T')[0],
    category: '',
    vendor: '',
    totalExpense: undefined,
    tax: undefined,
    netExpense: undefined,
    notes: '',
  });

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    dateFrom: '',
    dateTo: '',
    category: '',
    vendor: '',
    amountMin: '',
    amountMax: '',
    notes: '',
  });

  const [showSplitModal, setShowSplitModal] = useState(false);
  const [splitTransactionData, setSplitTransactionData] = useState<ExpenseEntry | null>(null);

  const filteredAndSortedExpenses = useMemo(() => {
    let filtered = [...expenses];

    if (filters.dateFrom) {
      filtered = filtered.filter(entry => entry.date >= filters.dateFrom);
    }
    if (filters.dateTo) {
      filtered = filtered.filter(entry => entry.date <= filters.dateTo);
    }
    if (filters.category) {
      filtered = filtered.filter(entry => entry.category === filters.category);
    }
    if (filters.vendor) {
      filtered = filtered.filter(entry => entry.vendor?.toLowerCase().includes(filters.vendor.toLowerCase()));
    }
    if (filters.amountMin) {
      const minAmount = parseFloat(filters.amountMin);
      filtered = filtered.filter(entry => entry.netExpense >= minAmount);
    }
    if (filters.amountMax) {
      const maxAmount = parseFloat(filters.amountMax);
      filtered = filtered.filter(entry => entry.netExpense <= maxAmount);
    }
    if (filters.notes) {
      filtered = filtered.filter(entry => 
        entry.notes?.toLowerCase().includes(filters.notes.toLowerCase())
      );
    }

    return filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [expenses, filters]);

  const totalSpent = filteredAndSortedExpenses.reduce((sum, expense) => sum + expense.netExpense, 0);
  const totalEntries = filteredAndSortedExpenses.length;
  
  // Calculate total income to show amount remaining
  const totalIncome = income.reduce((sum, entry) => sum + entry.netIncome, 0);
  const amountRemaining = totalIncome - totalSpent;

  const addExpense = () => {
    if (newExpense.date && newExpense.category && newExpense.totalExpense && settings.expenseCategories.length > 0) {
      const expense: ExpenseEntry = {
        id: Date.now().toString(),
        date: newExpense.date!,
        category: newExpense.category!,
        vendor: newExpense.vendor || '',
        totalExpense: newExpense.totalExpense!,
        tax: newExpense.tax || 0,
        netExpense: newExpense.totalExpense! - (newExpense.tax || 0),
        notes: newExpense.notes || '',
      };
      
      const updatedExpenses = [...expenses, expense].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      onExpensesChange(updatedExpenses);
      setNewExpense({
        date: new Date().toISOString().split('T')[0],
        category: '',
        vendor: '',
        totalExpense: undefined,
        tax: undefined,
        netExpense: undefined,
        notes: '',
      });
    }
  };

  const removeExpense = (id: string) => {
    onExpensesChange(expenses.filter(expense => expense.id !== id));
  };

  const updateExpense = (id: string, field: keyof ExpenseEntry, value: any) => {
    const updatedExpenses = expenses.map(expense => {
      if (expense.id === id) {
        const updated = { ...expense, [field]: value };
        if (field === 'totalExpense' || field === 'tax') {
          updated.netExpense = updated.totalExpense - updated.tax;
        }
        return updated;
      }
      return expense;
    });
    const sortedExpenses = updatedExpenses.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    onExpensesChange(sortedExpenses);
  };

  const handleSplitTransaction = (splits: SplitTransaction[], totalAmount: number, tax: number, date: string) => {
    let updatedExpenses = expenses;
    if (splitTransactionData) {
      updatedExpenses = expenses.filter(entry => entry.id !== splitTransactionData.id);
    }
    
    const newEntries: ExpenseEntry[] = splits.map(split => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      date,
      category: split.category,
      vendor: splitTransactionData?.vendor || '',
      totalExpense: split.amount,
      tax: (tax * split.amount) / totalAmount,
      netExpense: split.amount - ((tax * split.amount) / totalAmount),
      notes: ''
    }));

    const finalExpenses = [...updatedExpenses, ...newEntries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    onExpensesChange(finalExpenses);
    
    setSelectedTransactionId(null);
    setSplitTransactionData(null);
  };

  const handleSplitButtonClick = () => {
    if (selectedTransactionId) {
      const selectedTransaction = expenses.find(entry => entry.id === selectedTransactionId);
      if (selectedTransaction) {
        setSplitTransactionData(selectedTransaction);
      }
    } else {
      setSplitTransactionData(null);
    }
    setShowSplitModal(true);
  };

  const clearFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      category: '',
      vendor: '',
      amountMin: '',
      amountMax: '',
      notes: '',
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="h-full bg-gradient-to-br from-red-50 to-rose-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-8 h-full scrollable-content">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
              <TrendingDown className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Expense Tracking</h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">Monitor your business expenses and spending</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-all duration-200 hover:shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Spent</p>
                  <p className="text-3xl font-bold text-red-600 dark:text-red-400">{formatCurrency(totalSpent, settings.currency)}</p>
                </div>
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
                  <DollarSign className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-all duration-200 hover:shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Entries</p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{totalEntries}</p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-all duration-200 hover:shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Amount Remaining</p>
                  <p className={`text-3xl font-bold ${amountRemaining >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {formatCurrency(amountRemaining, settings.currency)}
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${amountRemaining >= 0 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                  <TrendingDown className={`w-6 h-6 ${amountRemaining >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
                </div>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-200 ${
                  hasActiveFilters 
                    ? 'bg-blue-600 text-white shadow-lg hover:bg-blue-700' 
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-md'
                }`}
              >
                <Filter className="w-5 h-5" />
                <span>Filters</span>
                {hasActiveFilters && (
                  <span className="bg-white bg-opacity-20 text-xs px-2 py-1 rounded-full">
                    {Object.values(filters).filter(v => v !== '').length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8 transition-colors duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Filter Expense Entries</h3>
              <div className="flex items-center space-x-3">
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
                  >
                    <X className="w-4 h-4" />
                    <span>Clear All</span>
                  </button>
                )}
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Calendar className="w-4 h-4" />
                  <span>Date From</span>
                </label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                />
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Calendar className="w-4 h-4" />
                  <span>Date To</span>
                </label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Tag className="w-4 h-4" />
                  <span>Expense Category</span>
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                >
                  <option value="">All Categories</option>
                  {settings.expenseCategories.map(category => (
                    <option key={category.id} value={category.name}>{category.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Search className="w-4 h-4" />
                  <span>Vendor</span>
                </label>
                <input
                  type="text"
                  value={filters.vendor}
                  onChange={(e) => setFilters({ ...filters, vendor: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                  placeholder="Search vendors..."
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <DollarSign className="w-4 h-4" />
                  <span>Min Amount</span>
                </label>
                <input
                  type="number"
                  value={filters.amountMin}
                  onChange={(e) => setFilters({ ...filters, amountMin: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <DollarSign className="w-4 h-4" />
                  <span>Max Amount</span>
                </label>
                <input
                  type="number"
                  value={filters.amountMax}
                  onChange={(e) => setFilters({ ...filters, amountMax: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Search className="w-4 h-4" />
                  <span>Search Notes</span>
                </label>
                <input
                  type="text"
                  value={filters.notes}
                  onChange={(e) => setFilters({ ...filters, notes: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                  placeholder="Search in notes..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Expense Entries */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-200">
          <div className="p-6 border-b border-gray-200 dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Expense Entries</h3>
          </div>
          
          <div className="space-y-4 p-6">
            {filteredAndSortedExpenses.map((expense) => (
              <div 
                key={expense.id} 
                className="p-6 rounded-xl border-2 transition-all duration-200 cursor-pointer border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-md"
              >
                <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-start">
                  <div className="min-h-[60px] flex flex-col justify-center">
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Date</label>
                    {editingId === expense.id ? (
                      <input
                        type="date"
                        value={expense.date}
                        onChange={(e) => updateExpense(expense.id, 'date', e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    ) : (
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{expense.date}</p>
                    )}
                  </div>

                  <div className="min-h-[60px] flex flex-col justify-center">
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Category</label>
                    {editingId === expense.id ? (
                      <select
                        value={expense.category}
                        onChange={(e) => updateExpense(expense.id, 'category', e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        {settings.expenseCategories.map(cat => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{expense.category}</p>
                    )}
                  </div>

                  <div className="min-h-[60px] flex flex-col justify-center">
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Vendor</label>
                    {editingId === expense.id ? (
                      <select
                        value={expense.vendor || ''}
                        onChange={(e) => updateExpense(expense.id, 'vendor', e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="">Select vendor...</option>
                        {settings.vendors.map(vendor => (
                          <option key={vendor.id} value={vendor.name}>{vendor.name}</option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{expense.vendor || '-'}</p>
                    )}
                  </div>

                  <div className="min-h-[60px] flex flex-col justify-center ml-4">
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Total Expense</label>
                    {editingId === expense.id ? (
                      <div className="flex items-center space-x-1">
                        <span className="text-gray-500 dark:text-gray-400 text-xs">{settings.currency}</span>
                        <input
                          type="number"
                          value={expense.totalExpense}
                          onChange={(e) => updateExpense(expense.id, 'totalExpense', Number(e.target.value))}
                          className="w-28 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          step="0.01"
                        />
                      </div>
                    ) : (
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(expense.totalExpense, settings.currency)}</p>
                    )}
                  </div>

                  <div className="min-h-[60px] flex flex-col justify-center ml-8">
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Tax</label>
                    {editingId === expense.id ? (
                      <input
                        type="number"
                        value={expense.tax}
                        onChange={(e) => updateExpense(expense.id, 'tax', Number(e.target.value))}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        step="0.01"
                      />
                    ) : (
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(expense.tax, settings.currency)}</p>
                    )}
                  </div>

                  <div className="min-h-[60px] flex flex-col justify-center ml-8">
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Net Expense</label>
                    <p className="text-sm font-bold text-red-600 dark:text-red-400">{formatCurrency(expense.netExpense, settings.currency)}</p>
                  </div>

                  <div className="min-h-[60px] flex flex-col justify-center">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center">
                        {expense.reconciliation?.isReconciled ? (
                          <div className="w-3 h-3 bg-green-500 rounded-full" title="Reconciled"></div>
                        ) : expense.reconciliation?.clearedDate ? (
                          <div className="w-3 h-3 bg-blue-500 rounded-full" title="Cleared"></div>
                        ) : (
                          <div className="w-3 h-3 bg-gray-400 rounded-full" title="Unreconciled"></div>
                        )}
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingId(editingId === expense.id ? null : expense.id);
                        }}
                        className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSplitTransactionData(expense);
                          setShowSplitModal(true);
                        }}
                        className="text-purple-500 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors duration-200"
                        title="Split Transaction"
                      >
                        <Split className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeExpense(expense.id);
                        }}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {(editingId === expense.id || expense.notes) && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Notes</label>
                    {editingId === expense.id ? (
                      <textarea
                        value={expense.notes}
                        onChange={(e) => updateExpense(expense.id, 'notes', e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                        rows={2}
                        placeholder="Add notes..."
                      />
                    ) : expense.notes ? (
                      <p className="text-sm text-gray-600 dark:text-gray-400">{expense.notes}</p>
                    ) : null}
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredAndSortedExpenses.length === 0 && (
            <div className="text-center py-12">
              <TrendingDown className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              {hasActiveFilters ? (
                <div>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">No expense entries match your current filters.</p>
                  <button
                    onClick={clearFilters}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                  >
                    Clear filters to see all entries
                  </button>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No expense entries yet. Add your first entry below!</p>
              )}
            </div>
          )}
        </div>

        {/* Add New Expense Card */}
        {settings.expenseCategories.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mt-8 transition-colors duration-200">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Add New Expense Entry</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date</label>
              <input
                type="date"
                value={newExpense.date}
                onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
              <select
                value={newExpense.category}
                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
              >
                <option value="">Select category...</option>
                {settings.expenseCategories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Vendor</label>
              <select
                value={newExpense.vendor || ''}
                onChange={(e) => setNewExpense({ ...newExpense, vendor: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
              >
                <option value="">Select vendor...</option>
                {settings.vendors.map(vendor => (
                  <option key={vendor.id} value={vendor.name}>{vendor.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Total Expense</label>
              <div className="flex items-center space-x-2">
                <span className="text-gray-500 dark:text-gray-400 text-sm">{settings.currency}</span>
                <input
                  type="number"
                  value={newExpense.totalExpense || ''}
                  onChange={(e) => setNewExpense({ ...newExpense, totalExpense: Number(e.target.value) })}
                  className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="flex items-end">
              <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tax</label>
              <input
                type="number"
                value={newExpense.tax || ''}
                onChange={(e) => setNewExpense({ ...newExpense, tax: Number(e.target.value) })}
                className="w-20 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                step="0.01"
                placeholder="0.00"
              />
              </div>
              <button
                onClick={addExpense}
                className="ml-4 flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium whitespace-nowrap"
              >
                <Plus className="w-5 h-5" />
                <span>Add</span>
              </button>
            </div>
          </div>
          {newExpense.totalExpense && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="text-red-700 dark:text-red-300 text-sm text-center">
                Net Expense: <span className="font-semibold">{formatCurrency((newExpense.totalExpense || 0) - (newExpense.tax || 0), settings.currency)}</span>
              </p>
            </div>
          )}
        </div>
        ) : (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-6 mt-8 text-center">
            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Setup Required</h3>
            <p className="text-yellow-700 dark:text-yellow-300 mb-4">
              Before you can add expense entries, you need to set up your expense categories in the Setup tab.
            </p>
            <button
              onClick={() => window.location.hash = '#setup'}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors duration-200"
            >
              Go to Setup
            </button>
          </div>
        )}

        <SplitModal
          isOpen={showSplitModal}
          onClose={() => setShowSplitModal(false)}
          onSplit={handleSplitTransaction}
          settings={settings}
          existingTransaction={splitTransactionData}
        />
      </div>
    </div>
  );
};

export default ExpenseLog;