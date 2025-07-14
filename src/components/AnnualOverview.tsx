import React, { useState } from 'react';
import { IncomeEntry, ExpenseEntry, AppSettings } from '../types';
import { formatCurrency, calculateTotalIncome, calculateTotalExpenses, calculateProfit, filterEntriesByMonth, getMonthName } from '../utils/calculations';
import PieChart from './PieChart';

interface AnnualOverviewProps {
  income: IncomeEntry[];
  expenses: ExpenseEntry[];
  settings: AppSettings;
}

const AnnualOverview: React.FC<AnnualOverviewProps> = ({ income, expenses, settings }) => {
  const [selectedYear, setSelectedYear] = useState(2025);
  
  // Get unique years from income and expense data
  const getAvailableYears = () => {
    const allDates = [
      ...income.map(entry => entry.date),
      ...expenses.map(entry => entry.date)
    ];
    
    const years = allDates.map(date => new Date(date).getFullYear());
    const uniqueYears = [...new Set(years)].sort((a, b) => b - a); // Sort descending
    
    return uniqueYears.length > 0 ? uniqueYears : [2025]; // Default to 2025 if no data
  };

  const availableYears = getAvailableYears();
  const currentYear = selectedYear;
  
  // Filter data by selected year
  const yearlyIncome = income.filter(entry => new Date(entry.date).getFullYear() === currentYear);
  const yearlyExpenses = expenses.filter(entry => new Date(entry.date).getFullYear() === currentYear);
  
  const totalIncome = calculateTotalIncome(yearlyIncome);
  const totalExpenses = calculateTotalExpenses(yearlyExpenses);
  const totalProfit = calculateProfit(totalIncome, totalExpenses);

  // Income breakdown by category
  const incomeByCategory = yearlyIncome.reduce((acc, entry) => {
    acc[entry.category] = (acc[entry.category] || 0) + entry.netIncome;
    return acc;
  }, {} as Record<string, number>);

  // Calculate expense breakdown
  const expensesByCategory = yearlyExpenses.reduce((acc, expense) => {
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

  // Monthly breakdown
  const monthlyData = Array.from({ length: 12 }, (_, monthIndex) => {
    const monthlyIncome = filterEntriesByMonth(yearlyIncome, currentYear, monthIndex);
    const monthlyExpenses = filterEntriesByMonth(yearlyExpenses, currentYear, monthIndex);
    const monthProfit = calculateTotalIncome(monthlyIncome) - calculateTotalExpenses(monthlyExpenses);
    
    return {
      month: getMonthName(monthIndex),
      income: calculateTotalIncome(monthlyIncome),
      expenses: calculateTotalExpenses(monthlyExpenses),
      profit: monthProfit,
    };
  });

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900 transition-colors duration-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-8 h-full scrollable-content">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Annual Overview</h1>
            <p className="text-gray-600 dark:text-gray-400">Financial summary for {currentYear}</p>
          </div>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
          >
            {availableYears.map(year => (
              <option key={year} value={year}>
                {year}
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

        {/* Annual Statistics */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8 transition-colors duration-200">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Annual Statistics</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{yearlyIncome.length}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Income Entries</p>
              </div>
              <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-xl font-bold text-red-600 dark:text-red-400">{yearlyExpenses.length}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Expense Entries</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Highest Monthly Income</span>
                  <span className="font-semibold text-purple-600 dark:text-purple-400">{formatCurrency(Math.max(...monthlyData.map(m => m.income)), settings.currency)}</span>
                </div>
              </div>
              <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Highest Monthly Expenses</span>
                  <span className="font-semibold text-orange-600 dark:text-orange-400">{formatCurrency(Math.max(...monthlyData.map(m => m.expenses)), settings.currency)}</span>
                </div>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Best Monthly Profit</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {formatCurrency(Math.max(...monthlyData.map(m => m.profit)), settings.currency)}
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
              <div className="text-center text-gray-500 dark:text-gray-400 py-12">No income recorded</div>
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
              <div className="text-center text-gray-500 dark:text-gray-400 py-12">No expenses recorded</div>
            )}
          </div>
        </div>

        {/* Monthly Breakdown Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-8 transition-colors duration-200">
          <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600 transition-colors duration-200">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Monthly Breakdown</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700 transition-colors duration-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Month</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Income</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Expenses</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Profit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {monthlyData.map((month, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{month.month} {currentYear}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white text-right">{formatCurrency(month.income, settings.currency)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white text-right">{formatCurrency(month.expenses, settings.currency)}</td>
                    <td className={`px-6 py-4 text-sm font-medium text-right ${month.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(month.profit, settings.currency)}
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50 dark:bg-gray-700 font-semibold transition-colors duration-200">
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">Total</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white text-right">{formatCurrency(totalIncome, settings.currency)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white text-right">{formatCurrency(totalExpenses, settings.currency)}</td>
                  <td className={`px-6 py-4 text-sm text-right ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(totalProfit, settings.currency)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnualOverview;