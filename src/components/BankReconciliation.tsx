import React, { useState, useMemo } from 'react';
import { IncomeEntry, ExpenseEntry, AppSettings, ReconciliationStatus } from '../types';
import { formatCurrency } from '../utils/calculations';
import { CheckCircle, XCircle, Calendar, DollarSign, FileText, Filter, X, Search, Download, Play, Save } from 'lucide-react';
import jsPDF from 'jspdf';

interface BankReconciliationProps {
  income: IncomeEntry[];
  expenses: ExpenseEntry[];
  settings: AppSettings;
  onIncomeChange: (income: IncomeEntry[]) => void;
  onExpensesChange: (expenses: ExpenseEntry[]) => void;
  onSettingsChange: (settings: AppSettings) => void;
}

interface ReconciliationSession {
  startDate: string;
  endDate: string;
  openingBalance: number | '';
  endingBalance: number | '';
  isActive: boolean;
}

const BankReconciliation: React.FC<BankReconciliationProps> = ({ 
  income, 
  expenses, 
  settings, 
  onIncomeChange, 
  onExpensesChange,
  onSettingsChange
}) => {
  const [reconciliationSession, setReconciliationSession] = useState<ReconciliationSession>({
    startDate: settings.lastReconciliationDate || settings.startDate,
    endDate: new Date().toISOString().split('T')[0],
    openingBalance: settings.openingBalance || '',
    endingBalance: '',
    isActive: false
  });

  const [filters, setFilters] = useState({
    showReconciled: true,
    showUnreconciled: true,
    searchTerm: ''
  });

  const [selectedTransactions, setSelectedTransactions] = useState<Set<string>>(new Set());
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Get transactions within reconciliation period
  const reconciliationTransactions = useMemo(() => {
    const incomeTransactions = income
      .filter(entry => entry.date >= reconciliationSession.startDate && entry.date <= reconciliationSession.endDate)
      .map(entry => ({
        ...entry,
        type: 'income' as const,
        amount: entry.netIncome,
        description: entry.category
      }));
    
    const expenseTransactions = expenses
      .filter(entry => entry.date >= reconciliationSession.startDate && entry.date <= reconciliationSession.endDate)
      .map(entry => ({
        ...entry,
        type: 'expense' as const,
        amount: entry.netExpense,
        description: entry.category
      }));
    
    return [...incomeTransactions, ...expenseTransactions].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [income, expenses, reconciliationSession.startDate, reconciliationSession.endDate]);

  // Apply filters
  const filteredTransactions = useMemo(() => {
    return reconciliationTransactions.filter(transaction => {
      // Reconciliation status filter
      const isReconciled = transaction.reconciliation?.isReconciled || false;
      if (!filters.showReconciled && isReconciled) return false;
      if (!filters.showUnreconciled && !isReconciled) return false;
      
      // Search filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesDescription = transaction.description.toLowerCase().includes(searchLower);
        const matchesNotes = transaction.notes?.toLowerCase().includes(searchLower) || false;
        const matchesBankRef = transaction.reconciliation?.bankReference?.toLowerCase().includes(searchLower) || false;
        if (!matchesDescription && !matchesNotes && !matchesBankRef) return false;
      }
      
      return true;
    });
  }, [reconciliationTransactions, filters]);

  // Calculate reconciliation summary
  const reconciliationSummary = useMemo(() => {
    const openingBalance = typeof reconciliationSession.openingBalance === 'number' ? reconciliationSession.openingBalance : 0;
    const endingBalance = typeof reconciliationSession.endingBalance === 'number' ? reconciliationSession.endingBalance : 0;
    
    const reconciledIncome = reconciliationTransactions
      .filter(t => t.type === 'income' && t.reconciliation?.isReconciled)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const reconciledExpenses = reconciliationTransactions
      .filter(t => t.type === 'expense' && t.reconciliation?.isReconciled)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const unreconciledIncome = reconciliationTransactions
      .filter(t => t.type === 'income' && !t.reconciliation?.isReconciled)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const unreconciledExpenses = reconciliationTransactions
      .filter(t => t.type === 'expense' && !t.reconciliation?.isReconciled)
      .reduce((sum, t) => sum + t.amount, 0);

    const calculatedBalance = openingBalance + reconciledIncome - reconciledExpenses;
    const difference = endingBalance - calculatedBalance;

    return {
      openingBalance,
      reconciledIncome,
      reconciledExpenses,
      unreconciledIncome,
      unreconciledExpenses,
      calculatedBalance,
      endingBalance,
      difference,
      isBalanced: Math.abs(difference) < 0.01
    };
  }, [reconciliationTransactions, reconciliationSession]);

  const startReconciliation = () => {
    setReconciliationSession({
      ...reconciliationSession,
      isActive: true
    });
  };

  const finishReconciliation = () => {
    if (reconciliationSummary.isBalanced) {
      // Update settings with last reconciliation date
      onSettingsChange({
        ...settings,
        lastReconciliationDate: reconciliationSession.endDate,
        openingBalance: typeof reconciliationSession.endingBalance === 'number' ? reconciliationSession.endingBalance : 0
      });

      // Mark all reconciled transactions as cleared
      const updatedIncome = income.map(entry => {
        if (entry.reconciliation?.isReconciled && 
            entry.date >= reconciliationSession.startDate && 
            entry.date <= reconciliationSession.endDate) {
          return {
            ...entry,
            reconciliation: {
              ...entry.reconciliation,
              clearedDate: new Date().toISOString().split('T')[0]
            }
          };
        }
        return entry;
      });

      const updatedExpenses = expenses.map(entry => {
        if (entry.reconciliation?.isReconciled && 
            entry.date >= reconciliationSession.startDate && 
            entry.date <= reconciliationSession.endDate) {
          return {
            ...entry,
            reconciliation: {
              ...entry.reconciliation,
              clearedDate: new Date().toISOString().split('T')[0]
            }
          };
        }
        return entry;
      });

      onIncomeChange(updatedIncome);
      onExpensesChange(updatedExpenses);

      setReconciliationSession({
        ...reconciliationSession,
        isActive: false
      });

      alert('Reconciliation completed successfully!');
    } else {
      alert(`Cannot finish reconciliation. Difference of ${formatCurrency(Math.abs(reconciliationSummary.difference), settings.currency)} must be resolved.`);
    }
  };

  const toggleReconciliation = (transactionId: string, type: 'income' | 'expense') => {
    if (!reconciliationSession.isActive) return;

    const updateTransaction = (transactions: (IncomeEntry | ExpenseEntry)[], onChange: Function) => {
      const updated = transactions.map(transaction => {
        if (transaction.id === transactionId) {
          const currentStatus = transaction.reconciliation?.isReconciled || false;
          return {
            ...transaction,
            reconciliation: {
              ...transaction.reconciliation,
              isReconciled: !currentStatus,
              reconciledDate: !currentStatus ? new Date().toISOString().split('T')[0] : undefined,
              bankReference: transaction.reconciliation?.bankReference || '',
              notes: transaction.reconciliation?.notes || ''
            }
          };
        }
        return transaction;
      });
      onChange(updated);
    };

    if (type === 'income') {
      updateTransaction(income, onIncomeChange);
    } else {
      updateTransaction(expenses, onExpensesChange);
    }
  };

  const updateReconciliationDetails = (
    transactionId: string, 
    type: 'income' | 'expense', 
    details: Partial<ReconciliationStatus>
  ) => {
    const updateTransaction = (transactions: (IncomeEntry | ExpenseEntry)[], onChange: Function) => {
      const updated = transactions.map(transaction => {
        if (transaction.id === transactionId) {
          return {
            ...transaction,
            reconciliation: {
              ...transaction.reconciliation,
              ...details
            }
          };
        }
        return transaction;
      });
      onChange(updated);
    };

    if (type === 'income') {
      updateTransaction(income, onIncomeChange);
    } else {
      updateTransaction(expenses, onExpensesChange);
    }
  };

  const generateReconciliationReport = async () => {
    setIsGeneratingReport(true);
    
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      
      // Header
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Bank Reconciliation Report', pageWidth / 2, 25, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Period: ${reconciliationSession.startDate} to ${reconciliationSession.endDate}`, pageWidth / 2, 35, { align: 'center' });
      pdf.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 45, { align: 'center' });
      
      let yPos = 65;
      
      // Reconciliation Summary
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Reconciliation Summary', 20, yPos);
      yPos += 15;
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      const summaryData = [
        ['Opening Balance', formatCurrency(reconciliationSummary.openingBalance, settings.currency)],
        ['Reconciled Income', formatCurrency(reconciliationSummary.reconciledIncome, settings.currency)],
        ['Reconciled Expenses', formatCurrency(reconciliationSummary.reconciledExpenses, settings.currency)],
        ['Calculated Balance', formatCurrency(reconciliationSummary.calculatedBalance, settings.currency)],
        ['Statement Ending Balance', formatCurrency(reconciliationSummary.endingBalance, settings.currency)],
        ['Difference', formatCurrency(reconciliationSummary.difference, settings.currency)]
      ];
      
      summaryData.forEach(([label, value]) => {
        pdf.text(label + ':', 25, yPos);
        pdf.text(value, 100, yPos);
        yPos += 6;
      });
      
      yPos += 15;
      
      // Unreconciled Transactions
      const unreconciledTransactions = reconciliationTransactions.filter(t => !t.reconciliation?.isReconciled);
      
      if (unreconciledTransactions.length > 0) {
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Unreconciled Transactions', 20, yPos);
        yPos += 10;
        
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        
        // Table headers
        pdf.text('Date', 20, yPos);
        pdf.text('Type', 45, yPos);
        pdf.text('Description', 65, yPos);
        pdf.text('Amount', 130, yPos);
        pdf.text('Notes', 160, yPos);
        
        yPos += 5;
        pdf.line(20, yPos, 190, yPos);
        yPos += 5;
        
        unreconciledTransactions.forEach((transaction) => {
          if (yPos > 270) {
            pdf.addPage();
            yPos = 20;
          }
          
          pdf.text(transaction.date, 20, yPos);
          pdf.text(transaction.type === 'income' ? 'Inc' : 'Exp', 45, yPos);
          pdf.text(transaction.description.substring(0, 20), 65, yPos);
          pdf.text(formatCurrency(transaction.amount, settings.currency), 130, yPos);
          pdf.text((transaction.notes || '').substring(0, 15), 160, yPos);
          yPos += 6;
        });
      }
      
      pdf.save(`Bank-Reconciliation-${reconciliationSession.startDate}-to-${reconciliationSession.endDate}.pdf`);
    } catch (error) {
      console.error('Error generating reconciliation report:', error);
      alert('Error generating reconciliation report');
    }
    
    setIsGeneratingReport(false);
  };

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900 transition-colors duration-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-8 h-full scrollable-content">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Bank Reconciliation</h1>
            <p className="text-gray-600 dark:text-gray-400">QuickBooks-style bank statement reconciliation</p>
          </div>
          <div className="flex items-center space-x-4">
            {!reconciliationSession.isActive ? (
              <button
                onClick={startReconciliation}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
              >
                <Play className="w-4 h-4" />
                <span>Start Reconciliation</span>
              </button>
            ) : (
              <>
                <button
                  onClick={finishReconciliation}
                  disabled={!reconciliationSummary.isBalanced}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  <span>Finish Reconciliation</span>
                </button>
                <button
                  onClick={() => setReconciliationSession({ ...reconciliationSession, isActive: false })}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </>
            )}
            <button
              onClick={generateReconciliationReport}
              disabled={isGeneratingReport}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isGeneratingReport ? 'Generating...' : 'Export Report'}</span>
            </button>
          </div>
        </div>

        {/* Reconciliation Setup */}
        {!reconciliationSession.isActive && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8 transition-colors duration-200">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Reconciliation Setup</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start Date</label>
                <input
                  type="date"
                  value={reconciliationSession.startDate}
                  onChange={(e) => setReconciliationSession({ ...reconciliationSession, startDate: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">End Date</label>
                <input
                  type="date"
                  value={reconciliationSession.endDate}
                  onChange={(e) => setReconciliationSession({ ...reconciliationSession, endDate: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Opening Balance</label>
                <input
                  type="number"
                  step="0.01"
                  value={reconciliationSession.openingBalance}
                  onChange={(e) => setReconciliationSession({ 
                    ...reconciliationSession, 
                    openingBalance: e.target.value === '' ? '' : Number(e.target.value) 
                  })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ending Balance</label>
                <input
                  type="number"
                  step="0.01"
                  value={reconciliationSession.endingBalance}
                  onChange={(e) => setReconciliationSession({ 
                    ...reconciliationSession, 
                    endingBalance: e.target.value === '' ? '' : Number(e.target.value) 
                  })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
        )}

        {/* Reconciliation Summary */}
        {reconciliationSession.isActive && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Opening Balance</h3>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(reconciliationSummary.openingBalance, settings.currency)}
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Reconciled Income</h3>
              <p className="text-xl font-bold text-green-600">
                {formatCurrency(reconciliationSummary.reconciledIncome, settings.currency)}
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Reconciled Expenses</h3>
              <p className="text-xl font-bold text-red-600">
                {formatCurrency(reconciliationSummary.reconciledExpenses, settings.currency)}
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Calculated Balance</h3>
              <p className="text-xl font-bold text-blue-600">
                {formatCurrency(reconciliationSummary.calculatedBalance, settings.currency)}
              </p>
            </div>
            
            <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 p-6 transition-colors duration-200 ${
              reconciliationSummary.isBalanced 
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                : 'border-red-500 bg-red-50 dark:bg-red-900/20'
            }`}>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Difference</h3>
              <p className={`text-xl font-bold ${
                reconciliationSummary.isBalanced ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(reconciliationSummary.difference, settings.currency)}
              </p>
              <p className="text-xs mt-1">
                {reconciliationSummary.isBalanced ? 'Balanced ✓' : 'Out of Balance'}
              </p>
            </div>
          </div>
        )}

        {/* Filters */}
        {reconciliationSession.isActive && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6 transition-colors duration-200">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showReconciled"
                  checked={filters.showReconciled}
                  onChange={(e) => setFilters({ ...filters, showReconciled: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="showReconciled" className="text-sm text-gray-700 dark:text-gray-300">
                  Show Reconciled
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showUnreconciled"
                  checked={filters.showUnreconciled}
                  onChange={(e) => setFilters({ ...filters, showUnreconciled: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="showUnreconciled" className="text-sm text-gray-700 dark:text-gray-300">
                  Show Unreconciled
                </label>
              </div>
              
              <div className="flex items-center space-x-2 flex-1 max-w-md">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={filters.searchTerm}
                  onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Search transactions..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Transactions Table */}
        {reconciliationSession.isActive && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 transition-colors duration-200">
                  <tr>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">✓</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Description</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Bank Ref</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {filteredTransactions.map((transaction) => (
                    <tr 
                      key={transaction.id} 
                      className={`transition-colors duration-200 ${
                        transaction.reconciliation?.isReconciled 
                          ? 'bg-green-50 dark:bg-green-900/20' 
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => toggleReconciliation(transaction.id, transaction.type)}
                          className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                            transaction.reconciliation?.isReconciled
                              ? 'bg-green-600 border-green-600 text-white'
                              : 'border-gray-300 hover:border-green-500'
                          }`}
                        >
                          {transaction.reconciliation?.isReconciled && <CheckCircle className="w-4 h-4" />}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{transaction.date}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.type === 'income' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        }`}>
                          {transaction.type === 'income' ? 'Income' : 'Expense'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{transaction.description}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white text-right font-medium">
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount, settings.currency)}
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={transaction.reconciliation?.bankReference || ''}
                          onChange={(e) => updateReconciliationDetails(transaction.id, transaction.type, {
                            bankReference: e.target.value
                          })}
                          className="w-full p-1 text-xs border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                          placeholder="Bank ref..."
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {reconciliationSession.isActive && filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No transactions found for the selected period and filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BankReconciliation;