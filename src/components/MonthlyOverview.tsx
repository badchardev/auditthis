import React, { useState } from 'react';
import { IncomeEntry, ExpenseEntry, AppSettings } from '../types';
import { formatCurrency, calculateTotalIncome, calculateTotalExpenses, calculateProfit, filterEntriesByMonth, getMonthYear, getMonthName } from '../utils/calculations';
import PieChart from './PieChart';

interface MonthlyOverviewProps {
  income: IncomeEntry[];
  expenses: ExpenseEntry[];
  settings: AppSettings;
}

const MonthlyOverview: React.FC<MonthlyOverviewProps> = ({ income, expenses, settings }) => {
  // Get unique year-month combinations from income and expense data
  const getAvailableMonths = () => {
    const allDates = [
      ...income.map(entry => entry.date),
      ...expenses.map(entry => entry.date)
    ];
    
    const yearMonths = allDates.map(date => {
      const d = new Date(date);
      return {
        year: d.getFullYear(),
        month: d.getMonth(),
        value: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
        display: `${getMonthName(d.getMonth())} ${d.getFullYear()}`
      };
    });
    
    // Remove duplicates and sort by year-month
    const uniqueYearMonths = yearMonths.filter((item, index, self) => 
      index === self.findIndex(t => t.value === item.value)
    ).sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year; // Sort years descending
      return b.month - a.month; // Sort months descending within same year
    });
    
    return uniqueYearMonths.length > 0 ? uniqueYearMonths : [{
      year: 2025,
      month: 0,
      value: '2025-01',
      display: 'Jan 2025'
    }];
  };

  const availableMonths = getAvailableMonths();
  const [selectedValue, setSelectedValue] = useState(availableMonths[0]?.value || '2025-01');
  
  // Parse selected value to get year and month
  const [selectedYear, selectedMonth] = selectedValue.split('-').map(Number);
  const selectedDate = new Date(selectedYear, selectedMonth - 1, 1);
  
  const currentYear = selectedDate.getFullYear();
  const currentMonth = selectedDate.getMonth();
  
  const monthlyIncome = filterEntriesByMonth(income, currentYear, currentMonth);
  const monthlyExpenses = filterEntriesByMonth(expenses, currentYear, currentMonth);
  
  const totalIncome = calculateTotalIncome(monthlyIncome);
  const totalExpenses = calculateTotalExpenses(monthlyExpenses);
  const totalProfit = calculateProfit(totalIncome, totalExpenses);

  // Income breakdown by category
  const incomeByCategory = monthlyIncome.reduce((acc, entry) => {
    acc[entry.category] = (acc[entry.category] || 0) + entry.netIncome;
    return acc;
  }, {} as Record<string, number>);

  // Calculate expense breakdown
  const expensesByCategory = monthlyExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.netExpense;
    return acc;
  }, {} as Record<string, number>);

  const pieChartData = Object.entries(expensesByCategory).map(([category, amount], index) => {
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
    return {
      label: category,
      value: amount,
      color: colors[index % colors.length],
      percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
    };
  });

  // Income breakdown pie chart data
  const incomePieChartData = Object.entries(incomeByCategory).map(([category, amount], index) => {
    const colors = ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899', '#EF4444'];
    return {
      label: category,
      value: amount,
      color: colors[index % colors.length],
      percentage: totalIncome > 0 ? (amount / totalIncome) * 100 : 0,
    };
  });

  const expenseCategoryBreakdown = settings.expenseCategories.map(category => {
    const categoryExpenses = monthlyExpenses.filter(e => e.category === category.name);
    const netExpense = categoryExpenses.reduce((sum, e) => sum + e.netExpense, 0);
    const tax = categoryExpenses.reduce((sum, e) => sum + e.tax, 0);
    const total = categoryExpenses.reduce((sum, e) => sum + e.totalExpense, 0);
    
    return {
      category: category.name,
      netExpense,
      tax,
      total,
    };
  });

  // Vendor breakdown for expenses
  const vendorBreakdown = monthlyExpenses.reduce((acc, expense) => {
    if (expense.vendor && expense.vendor.trim() !== '') {
      const vendor = expense.vendor;
      if (!acc[vendor]) {
        acc[vendor] = { netExpense: 0, tax: 0, total: 0, count: 0 };
      }
      acc[vendor].netExpense += expense.netExpense;
      acc[vendor].tax += expense.tax;
      acc[vendor].total += expense.totalExpense;
      acc[vendor].count += 1;
    }
    return acc;
  }, {} as Record<string, { netExpense: number; tax: number; total: number; count: number }>);

  const topVendors = Object.entries(vendorBreakdown)
    .sort(([,a], [,b]) => b.total - a.total)
    .slice(0, 5);

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900 transition-colors duration-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-8 h-full scrollable-content">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Monthly Overview</h1>
            <p className="text-gray-600 dark:text-gray-400">Financial summary for {getMonthYear(selectedDate)}</p>
          </div>
          <select
            value={selectedValue}
            onChange={(e) => {
              setSelectedValue(e.target.value);
            }}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
          >
            {availableMonths.map((monthData) => (
              <option key={monthData.value} value={monthData.value}>
                {monthData.display}
              </option>
            ))}
          </select>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 text-center">Total Income</h3>
            <p className="text-3xl font-bold text-green-600 text-center">{formatCurrency(totalIncome, settings.currency)}</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 text-center">Total Expenses</h3>
            <p className="text-3xl font-bold text-red-600 text-center">{formatCurrency(totalExpenses, settings.currency)}</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 text-center">Total Profit</h3>
            <p className={`text-3xl font-bold text-center ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(totalProfit, settings.currency)}
            </p>
          </div>
        </div>

        {/* Monthly Statistics */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8 transition-colors duration-200">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Monthly Statistics</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{monthlyIncome.length}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Income Entries</p>
              </div>
              <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-xl font-bold text-red-600 dark:text-red-400">{monthlyExpenses.length}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Expense Entries</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Average Income per Entry</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {monthlyIncome.length > 0 ? formatCurrency(totalIncome / monthlyIncome.length, settings.currency) : formatCurrency(0, settings.currency)}
                  </span>
                </div>
              </div>
              <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Average Expense per Entry</span>
                  <span className="font-semibold text-orange-600 dark:text-orange-400">
                    {monthlyExpenses.length > 0 ? formatCurrency(totalExpenses / monthlyExpenses.length, settings.currency) : formatCurrency(0, settings.currency)}
                  </span>
                </div>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Profit Margin</span>
                  <span className="font-semibold text-purple-600 dark:text-purple-400">
                    {totalIncome > 0 ? `${((totalProfit / totalIncome) * 100).toFixed(1)}%` : '0.0%'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Income Pie Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 h-96 transition-colors duration-200">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Income by Stream</h3>
            {incomePieChartData.length > 0 ? (
              <div className="flex justify-center">
                <PieChart data={incomePieChartData} size={280} />
              </div>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400 py-12">No income recorded for this month</div>
            )}
          </div>

          {/* Expenses Pie Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 h-96 transition-colors duration-200">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Expenses by Category</h3>
            {pieChartData.length > 0 ? (
              <div className="flex justify-center">
                <PieChart data={pieChartData} size={280} />
              </div>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400 py-12">No expenses recorded for this month</div>
            )}
          </div>
        </div>

        {/* Detailed Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Income Stream Details */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-200">
            <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600 transition-colors duration-200">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Income Streams</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700 transition-colors duration-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Stream</th>
                    <th className="px-6 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Net Income</th>
                    <th className="px-6 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Sales Tax</th>
                    <th className="px-6 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {settings.incomeStreams.map((stream, index) => {
                    const streamIncome = incomeByCategory[stream.name] || 0;
                    const streamEntries = monthlyIncome.filter(e => e.category === stream.name);
                    const salesTax = streamEntries.reduce((sum, e) => sum + e.salesTax, 0);
                    const total = streamEntries.reduce((sum, e) => sum + e.totalIncome, 0);
                    
                    return (
                      <tr key={stream.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{stream.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white text-right">{formatCurrency(streamIncome, settings.currency)}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white text-right">{formatCurrency(salesTax, settings.currency)}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white text-right">{formatCurrency(total, settings.currency)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Expense Category Details */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-200">
            <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600 transition-colors duration-200">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Expense Categories</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700 transition-colors duration-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Category</th>
                    <th className="px-6 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Net Expense</th>
                    <th className="px-6 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Tax</th>
                    <th className="px-6 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {expenseCategoryBreakdown.map((item, index) => (
                    <tr key={item.category} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{item.category}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white text-right">{formatCurrency(item.netExpense, settings.currency)}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white text-right">{formatCurrency(item.tax, settings.currency)}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white text-right">{formatCurrency(item.total, settings.currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MonthlyOverview;