import React, { useState } from 'react';
import { AppSettings, IncomeStream, ExpenseCategory, Vendor, AppData } from '../types';
import { Plus, Trash2, Download, Upload, Settings, DollarSign, Calendar, Tag, Building, BookOpen } from 'lucide-react';

interface SetupProps {
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
  appData: AppData;
  onDataRestore: (data: AppData) => void;
  onDownloadBackup: () => void;
  onRestoreBackup: (file: File) => void;
}

const Setup: React.FC<SetupProps> = ({ 
  settings, 
  onSettingsChange, 
  appData, 
  onDataRestore, 
  onDownloadBackup, 
  onRestoreBackup 
}) => {
  const [newIncomeStream, setNewIncomeStream] = useState('');
  const [newExpenseCategory, setNewExpenseCategory] = useState('');
  const [newVendor, setNewVendor] = useState('');
  const [showUserManual, setShowUserManual] = useState(false);

  const addIncomeStream = () => {
    if (newIncomeStream.trim()) {
      const newStream: IncomeStream = {
        id: Date.now().toString(),
        name: newIncomeStream.trim(),
        isActive: true,
      };
      onSettingsChange({
        ...settings,
        incomeStreams: [...settings.incomeStreams, newStream],
      });
      setNewIncomeStream('');
    }
  };

  const removeIncomeStream = (id: string) => {
    onSettingsChange({
      ...settings,
      incomeStreams: settings.incomeStreams.filter(stream => stream.id !== id),
    });
  };

  const addExpenseCategory = () => {
    if (newExpenseCategory.trim()) {
      const newCategory: ExpenseCategory = {
        id: Date.now().toString(),
        name: newExpenseCategory.trim(),
        isActive: true,
      };
      onSettingsChange({
        ...settings,
        expenseCategories: [...settings.expenseCategories, newCategory],
      });
      setNewExpenseCategory('');
    }
  };

  const removeExpenseCategory = (id: string) => {
    onSettingsChange({
      ...settings,
      expenseCategories: settings.expenseCategories.filter(category => category.id !== id),
    });
  };

  const addVendor = () => {
    if (newVendor.trim()) {
      const vendor: Vendor = {
        id: Date.now().toString(),
        name: newVendor.trim(),
        isActive: true,
      };
      onSettingsChange({
        ...settings,
        vendors: [...settings.vendors, vendor],
      });
      setNewVendor('');
    }
  };

  const removeVendor = (id: string) => {
    onSettingsChange({
      ...settings,
      vendors: settings.vendors.filter(vendor => vendor.id !== id),
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onRestoreBackup(file);
      event.target.value = '';
    }
  };


  return (
    <>
    <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-8 h-full scrollable-content">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Settings className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Setup</h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">Configure your financial tracking preferences</p>
              </div>
            </div>
            <button
              onClick={() => setShowUserManual(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              <BookOpen className="w-5 h-5" />
              <span className="font-medium">User Manual</span>
            </button>
          </div>
        </div>

        {/* Data Management Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 mb-8 transition-colors duration-200">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Download className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Data Management</h2>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-6">
            <button
              onClick={onDownloadBackup}
              className="flex items-center space-x-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              <Download className="w-5 h-5" />
              <span className="font-medium">Download Backup</span>
            </button>
            
            <label className="flex items-center space-x-3 px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors duration-200 cursor-pointer shadow-lg hover:shadow-xl">
              <Upload className="w-5 h-5" />
              <span className="font-medium">Restore Backup</span>
              <input
                type="file"
                accept=".dawg,.json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
          
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-4">
            Backup files use the .dawg format and contain all your financial data
          </p>
        </div>

        {/* Configuration Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Currency and Start Date */}
          <div className="space-y-8">
            {/* Currency Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Currency</h3>
              </div>
              
              <select
                value={settings.currency}
                onChange={(e) => onSettingsChange({ ...settings, currency: e.target.value })}
                className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg transition-colors duration-200"
              >
                <option value="$">US Dollar ($)</option>
                <option value="€">Euro (€)</option>
                <option value="£">British Pound (£)</option>
                <option value="¥">Japanese Yen (¥)</option>
                <option value="₹">Indian Rupee (₹)</option>
                <option value="₽">Russian Ruble (₽)</option>
                <option value="₩">South Korean Won (₩)</option>
                <option value="₪">Israeli Shekel (₪)</option>
                <option value="₦">Nigerian Naira (₦)</option>
                <option value="₨">Pakistani Rupee (₨)</option>
                <option value="₡">Costa Rican Colón (₡)</option>
                <option value="₫">Vietnamese Dong (₫)</option>
                <option value="₴">Ukrainian Hryvnia (₴)</option>
                <option value="₸">Kazakhstani Tenge (₸)</option>
                <option value="₼">Azerbaijani Manat (₼)</option>
                <option value="₾">Georgian Lari (₾)</option>
                <option value="﷼">Saudi Riyal (﷼)</option>
                <option value="¢">Cent (¢)</option>
                <option value="₵">Ghanaian Cedi (₵)</option>
                <option value="₶">Livonian Pound (₶)</option>
                <option value="₷">Spesmilo (₷)</option>
                <option value="₹">Indian Rupee (₹)</option>
                <option value="₺">Turkish Lira (₺)</option>
                <option value="₻">Nordic Mark (₻)</option>
                <option value="₽">Russian Ruble (₽)</option>
                <option value="₿">Bitcoin (₿)</option>
                <option value="＄">Fullwidth Dollar Sign (＄)</option>
              </select>
            </div>

            {/* Start Date Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Start Date</h3>
              </div>
              
              <input
                type="date"
                value={settings.startDate}
                onChange={(e) => onSettingsChange({ ...settings, startDate: e.target.value })}
                className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg transition-colors duration-200"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                The date when you started tracking your finances
              </p>
            </div>
          </div>

          {/* Income Streams */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Tag className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Income Streams</h3>
            </div>
            
            <div className="space-y-4 mb-6">
              {settings.incomeStreams.map((stream) => (
                <div key={stream.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl transition-colors duration-200">
                  <span className="text-gray-900 dark:text-white font-medium">{stream.name}</span>
                  <button
                    onClick={() => removeIncomeStream(stream.id)}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="flex space-x-3">
              <input
                type="text"
                value={newIncomeStream}
                onChange={(e) => setNewIncomeStream(e.target.value)}
                placeholder="Add income stream"
                className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                onKeyPress={(e) => e.key === 'Enter' && addIncomeStream()}
              />
              <button
                onClick={addIncomeStream}
                className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors duration-200"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Expense Categories */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <Tag className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Expense Categories</h3>
            </div>
            
            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto scrollable-content">
              {settings.expenseCategories.map((category) => (
                <div key={category.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl transition-colors duration-200">
                  <span className="text-gray-900 dark:text-white font-medium">{category.name}</span>
                  <button
                    onClick={() => removeExpenseCategory(category.id)}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="flex space-x-3">
              <input
                type="text"
                value={newExpenseCategory}
                onChange={(e) => setNewExpenseCategory(e.target.value)}
                placeholder="Add expense category"
                className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                onKeyPress={(e) => e.key === 'Enter' && addExpenseCategory()}
              />
              <button
                onClick={addExpenseCategory}
                className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors duration-200"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Vendors */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Building className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Vendors</h3>
            </div>
            
            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto scrollable-content">
              {settings.vendors.map((vendor) => (
                <div key={vendor.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl transition-colors duration-200">
                  <span className="text-gray-900 dark:text-white font-medium">{vendor.name}</span>
                  <button
                    onClick={() => removeVendor(vendor.id)}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="flex space-x-3">
              <input
                type="text"
                value={newVendor}
                onChange={(e) => setNewVendor(e.target.value)}
                placeholder="Add vendor"
                className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                onKeyPress={(e) => e.key === 'Enter' && addVendor()}
              />
              <button
                onClick={addVendor}
                className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors duration-200"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* User Manual Modal */}
    {showUserManual && (
      <div className="fixed inset-0 z-[9999] bg-black bg-opacity-75 flex items-center justify-center p-4">
        <div className="max-w-6xl w-full max-h-[95vh] bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold mb-2">AuditThis! Complete User Manual</h1>
                <p className="text-blue-100">Comprehensive guide to all features and functionality</p>
              </div>
              <button
                onClick={() => setShowUserManual(false)}
                className="text-white hover:text-gray-200 transition-colors duration-200 p-2 hover:bg-white hover:bg-opacity-20 rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 overflow-y-auto max-h-[calc(95vh-200px)] scrollable-content">
            <div className="space-y-12">
              
              {/* Table of Contents */}
              <section>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 border-b-2 border-blue-500 pb-2">📋 Table of Contents</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
                  <div className="space-y-3">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <p className="font-bold text-blue-800 dark:text-blue-200 mb-2">🚀 Getting Started</p>
                      <ul className="space-y-1 text-gray-700 dark:text-gray-300">
                        <li>• First Time Setup</li>
                        <li>• Company Management</li>
                        <li>• Navigation Overview</li>
                        <li>• Theme & Interface</li>
                      </ul>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <p className="font-bold text-green-800 dark:text-green-200 mb-2">⚙️ Setup Tab</p>
                      <ul className="space-y-1 text-gray-700 dark:text-gray-300">
                        <li>• Currency Settings</li>
                        <li>• Start Date Configuration</li>
                        <li>• Income Streams</li>
                        <li>• Expense Categories</li>
                        <li>• Vendor Management</li>
                        <li>• Data Backup & Restore</li>
                      </ul>
                    </div>
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg">
                      <p className="font-bold text-emerald-800 dark:text-emerald-200 mb-2">📈 Income Tracking</p>
                      <ul className="space-y-1 text-gray-700 dark:text-gray-300">
                        <li>• Adding Income Entries</li>
                        <li>• Editing Transactions</li>
                        <li>• Advanced Filtering</li>
                        <li>• Transaction Splitting</li>
                        <li>• Statistics Dashboard</li>
                      </ul>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                      <p className="font-bold text-red-800 dark:text-red-200 mb-2">📉 Expense Tracking</p>
                      <ul className="space-y-1 text-gray-700 dark:text-gray-300">
                        <li>• Recording Expenses</li>
                        <li>• Vendor Assignment</li>
                        <li>• Tax Calculations</li>
                        <li>• Expense Filtering</li>
                        <li>• Split Transactions</li>
                      </ul>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                      <p className="font-bold text-purple-800 dark:text-purple-200 mb-2">📊 Financial Overviews</p>
                      <ul className="space-y-1 text-gray-700 dark:text-gray-300">
                        <li>• Monthly Reports</li>
                        <li>• Annual Summaries</li>
                        <li>• Charts & Analytics</li>
                        <li>• Pie Chart Breakdowns</li>
                        <li>• Trend Analysis</li>
                      </ul>
                    </div>
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                      <p className="font-bold text-indigo-800 dark:text-indigo-200 mb-2">📄 Professional Reports</p>
                      <ul className="space-y-1 text-gray-700 dark:text-gray-300">
                        <li>• PDF Generation</li>
                        <li>• Accountant Reports</li>
                        <li>• P&L Statements</li>
                        <li>• Simple vs Detailed</li>
                        <li>• Custom Date Ranges</li>
                      </ul>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-lg">
                      <p className="font-bold text-teal-800 dark:text-teal-200 mb-2">🧾 Invoice Management</p>
                      <ul className="space-y-1 text-gray-700 dark:text-gray-300">
                        <li>• Creating Invoices</li>
                        <li>• Client Information</li>
                        <li>• Item Management</li>
                        <li>• Tax Calculations</li>
                        <li>• PDF Export</li>
                      </ul>
                    </div>
                    <div className="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-lg">
                      <p className="font-bold text-cyan-800 dark:text-cyan-200 mb-2">✅ Bank Reconciliation</p>
                      <ul className="space-y-1 text-gray-700 dark:text-gray-300">
                        <li>• QB-style Process</li>
                        <li>• Transaction Matching</li>
                        <li>• Balance Verification</li>
                        <li>• Reconciliation Reports</li>
                        <li>• Status Tracking</li>
                      </ul>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                      <p className="font-bold text-orange-800 dark:text-orange-200 mb-2">🔧 Advanced Features</p>
                      <ul className="space-y-1 text-gray-700 dark:text-gray-300">
                        <li>• Multi-Company Support</li>
                        <li>• Data Import/Export</li>
                        <li>• Keyboard Shortcuts</li>
                        <li>• Dark/Light Themes</li>
                        <li>• Troubleshooting</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Getting Started */}
              <section>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 border-b-2 border-green-500 pb-2">🚀 1. Getting Started</h2>
                
                <div className="space-y-8">
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-8">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                      <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold mr-3">1</span>
                      First Time Setup
                    </h3>
                    <div className="space-y-6">
                      <p className="text-gray-700 dark:text-gray-300 text-lg">When you first open AuditThis!, you'll see a welcome screen that guides you through creating your first company.</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-blue-200 dark:border-blue-700">
                          <div className="flex items-center mb-4">
                            <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">1</span>
                            <h4 className="font-semibold text-gray-900 dark:text-white">Company Creation</h4>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 text-sm">Enter your company name in the text field and click "Create Company". This will be your primary business entity.</p>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-blue-200 dark:border-blue-700">
                          <div className="flex items-center mb-4">
                            <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">2</span>
                            <h4 className="font-semibold text-gray-900 dark:text-white">Demo Data</h4>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 text-sm">A "Demo Company" is automatically created with sample data to help you understand the interface and features.</p>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-blue-200 dark:border-blue-700">
                          <div className="flex items-center mb-4">
                            <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">3</span>
                            <h4 className="font-semibold text-gray-900 dark:text-white">Setup Completion</h4>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 text-sm">Click "Start Using AuditThis!" to begin using the application with your new company setup.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-8">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                      <span className="bg-gray-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold mr-3">2</span>
                      Company Management
                    </h3>
                    <div className="space-y-6">
                      <p className="text-gray-700 dark:text-gray-300 text-lg"><strong>Company Selector (Top Right Corner):</strong> The company dropdown allows you to manage multiple businesses.</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Available Actions:</h4>
                          <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                            <li className="flex items-start">
                              <span className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">✓</span>
                              <div>
                                <strong>Switch Companies:</strong> Click on any company name to switch to it instantly
                              </div>
                            </li>
                            <li className="flex items-start">
                              <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">+</span>
                              <div>
                                <strong>Create New Company:</strong> Click the green "New Company" button to add another business
                              </div>
                            </li>
                            <li className="flex items-start">
                              <span className="bg-red-100 text-red-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">🗑</span>
                              <div>
                                <strong>Delete Company:</strong> Click the red trash icon next to any company (except the last one)
                              </div>
                            </li>
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Company Information:</h4>
                          <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                            <li>• <strong>Company Name:</strong> Displayed prominently</li>
                            <li>• <strong>Creation Date:</strong> When the company was added</li>
                            <li>• <strong>Active Status:</strong> Shows which company is currently selected</li>
                            <li>• <strong>Data Separation:</strong> Each company has completely separate financial data</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                        <p className="text-yellow-800 dark:text-yellow-200 text-sm"><strong>⚠️ Important:</strong> Each company has completely separate financial data. Switching companies changes all visible data, reports, and settings.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-8">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                      <span className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold mr-3">3</span>
                      Navigation Overview
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-indigo-200 dark:border-indigo-700">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-white text-lg">🏠</span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">Setup</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Configuration hub</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">Configure settings, categories, vendors, and manage data backups</p>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-indigo-200 dark:border-indigo-700">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-white text-lg">📈</span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">Income</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Revenue tracking</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">Track revenue, earnings, and income streams with advanced filtering</p>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-indigo-200 dark:border-indigo-700">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-white text-lg">📉</span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">Expenses</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Expense management</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">Record business expenses with vendor tracking and categorization</p>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-indigo-200 dark:border-indigo-700">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-white text-lg">📊</span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">Monthly</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Monthly analysis</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">Monthly financial overview with charts and detailed breakdowns</p>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-indigo-200 dark:border-indigo-700">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-white text-lg">📅</span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">Annual</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Yearly summary</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">Comprehensive yearly financial summary with trend analysis</p>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-indigo-200 dark:border-indigo-700">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-white text-lg">📄</span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">Reports</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Professional PDFs</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">Generate professional PDF reports for accountants and tax purposes</p>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-indigo-200 dark:border-indigo-700">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-white text-lg">🧾</span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">Invoices</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Invoice creation</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">Create professional invoices with automatic calculations</p>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-indigo-200 dark:border-indigo-700">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 bg-cyan-600 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-white text-lg">✅</span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">Reconciliation</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Bank matching</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">QB-style bank statement reconciliation process</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-8">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                      <span className="bg-gray-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold mr-3">4</span>
                      Theme & Interface
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Theme Toggle:</h4>
                        <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                          <li>• Located in the top navigation bar</li>
                          <li>• Sun icon = Switch to Light Mode</li>
                          <li>• Moon icon = Switch to Dark Mode</li>
                          <li>• Preference saved automatically</li>
                          <li>• Follows system preference by default</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Interface Features:</h4>
                        <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                          <li>• Responsive design for all screen sizes</li>
                          <li>• Smooth animations and transitions</li>
                          <li>• Keyboard navigation support</li>
                          <li>• High contrast for accessibility</li>
                          <li>• Professional color schemes</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Setup Tab - Enhanced */}
              <section>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 border-b-2 border-blue-500 pb-2">⚙️ 2. Setup Tab - Complete Configuration Guide</h2>
                
                <div className="space-y-8">
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-8">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">💰 Currency Settings</h3>
                    <div className="space-y-6">
                      <p className="text-gray-700 dark:text-gray-300 text-lg"><strong>Purpose:</strong> Sets the currency symbol displayed throughout the application for all financial amounts.</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">How to Change Currency:</h4>
                          <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                            <li>Locate the "Currency" section in the Setup tab</li>
                            <li>Click the dropdown menu showing current currency</li>
                            <li>Select from 25+ supported currencies</li>
                            <li>Changes apply immediately to all financial displays</li>
                          </ol>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Supported Currencies:</h4>
                          <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <div>
                              <p>$ (USD) - US Dollar</p>
                              <p>€ (EUR) - Euro</p>
                              <p>£ (GBP) - British Pound</p>
                              <p>¥ (JPY) - Japanese Yen</p>
                              <p>₹ (INR) - Indian Rupee</p>
                              <p>₽ (RUB) - Russian Ruble</p>
                              <p>₩ (KRW) - Korean Won</p>
                              <p>₪ (ILS) - Israeli Shekel</p>
                            </div>
                            <div>
                              <p>₦ (NGN) - Nigerian Naira</p>
                              <p>₨ (PKR) - Pakistani Rupee</p>
                              <p>₡ (CRC) - Costa Rican Colón</p>
                              <p>₫ (VND) - Vietnamese Dong</p>
                              <p>₴ (UAH) - Ukrainian Hryvnia</p>
                              <p>₸ (KZT) - Kazakhstani Tenge</p>
                              <p>₺ (TRY) - Turkish Lira</p>
                              <p>₿ (BTC) - Bitcoin</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <p className="text-blue-800 dark:text-blue-200 text-sm"><strong>💡 Note:</strong> Currency changes affect display only, not calculations. All amounts remain in their original values - only the symbol changes.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-8">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">📅 Start Date Configuration</h3>
                    <div className="space-y-6">
                      <p className="text-gray-700 dark:text-gray-300 text-lg"><strong>Purpose:</strong> Defines when you began tracking finances with AuditThis! - serves as a reference point for all reports and analysis.</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Setting the Start Date:</h4>
                          <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                            <li>Find the "Start Date" section</li>
                            <li>Click the date input field</li>
                            <li>Use the date picker or type YYYY-MM-DD format</li>
                            <li>Choose the date you want to begin financial tracking</li>
                            <li>Date saves automatically when changed</li>
                          </ol>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Impact & Usage:</h4>
                          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                            <li>Used as reference point for reports</li>
                            <li>Helps with year-over-year comparisons</li>
                            <li>Important for tax year calculations</li>
                            <li>Used in bank reconciliation setup</li>
                            <li>Appears in generated PDF reports</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                        <p className="text-yellow-800 dark:text-yellow-200 text-sm"><strong>💡 Best Practice:</strong> Set this to the beginning of your fiscal year or when you started your business for most accurate reporting.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-8">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">🏷️ Income Streams Management</h3>
                    <div className="space-y-6">
                      <p className="text-gray-700 dark:text-gray-300 text-lg"><strong>Purpose:</strong> Define categories for different types of income your business receives. Essential for proper revenue categorization and tax reporting.</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Adding Income Streams:</h4>
                          <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                            <li>Scroll to the "Income Streams" section</li>
                            <li>Type the income stream name in the text field</li>
                            <li>Press Enter or click the blue "+" button</li>
                            <li>The new stream appears in the list immediately</li>
                            <li>Repeat for all income types your business has</li>
                          </ol>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Managing Existing Streams:</h4>
                          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                            <li><strong>View All Streams:</strong> Listed in gray boxes with stream names</li>
                            <li><strong>Delete Stream:</strong> Click the red trash icon next to any stream</li>
                            <li><strong>Reorder:</strong> Streams appear in creation order in dropdown menus</li>
                            <li><strong>Usage:</strong> Available in Income tab dropdown menus</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Example Income Streams by Business Type:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                            <h5 className="font-semibold text-emerald-600 mb-2">Service Business:</h5>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Consulting Services</li>
                              <li>• Training Workshops</li>
                              <li>• Support Services</li>
                              <li>• Project Work</li>
                            </ul>
                          </div>
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                            <h5 className="font-semibold text-emerald-600 mb-2">Retail Business:</h5>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Product Sales</li>
                              <li>• Online Sales</li>
                              <li>• Wholesale</li>
                              <li>• Subscription Revenue</li>
                            </ul>
                          </div>
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                            <h5 className="font-semibold text-emerald-600 mb-2">Creative Business:</h5>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Design Services</li>
                              <li>• Photography</li>
                              <li>• Licensing Fees</li>
                              <li>• Commission Work</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">📊 Expense Categories</h3>
                    <div className="space-y-6">
                      <p className="text-gray-700 dark:text-gray-300 text-lg"><strong>Purpose:</strong> Organize business expenses for better tracking, tax preparation, and financial analysis.</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Adding Categories:</h4>
                          <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                            <li>Find the "Expense Categories" section</li>
                            <li>Enter category name in the text field</li>
                            <li>Press Enter or click the blue "+" button</li>
                            <li>Category appears in the scrollable list</li>
                            <li>Maximum height of 264px with scroll for many categories</li>
                          </ol>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Category Management:</h4>
                          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                            <li><strong>Scrollable List:</strong> Categories shown in organized scrollable area</li>
                            <li><strong>Delete Categories:</strong> Red trash icon removes categories</li>
                            <li><strong>Usage:</strong> Categories appear in expense entry dropdowns</li>
                            <li><strong>Reporting:</strong> Used for expense breakdown in reports</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Recommended Categories (Tax-Friendly):</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                            <h5 className="font-semibold text-red-600 mb-2">Office & Operations:</h5>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Office Supplies</li>
                              <li>• Equipment</li>
                              <li>• Software/Subscriptions</li>
                              <li>• Utilities</li>
                              <li>• Rent/Lease</li>
                              <li>• Insurance</li>
                            </ul>
                          </div>
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                            <h5 className="font-semibold text-red-600 mb-2">Business Development:</h5>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Marketing/Advertising</li>
                              <li>• Professional Services</li>
                              <li>• Training/Education</li>
                              <li>• Networking Events</li>
                              <li>• Business Meals</li>
                              <li>• Travel Expenses</li>
                            </ul>
                          </div>
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                            <h5 className="font-semibold text-red-600 mb-2">Maintenance & Other:</h5>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Maintenance/Repairs</li>
                              <li>• Vehicle Expenses</li>
                              <li>• Bank Fees</li>
                              <li>• Legal/Accounting</li>
                              <li>• Taxes & Licenses</li>
                              <li>• Other</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-8">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">🏢 Vendor Management</h3>
                    <div className="space-y-6">
                      <p className="text-gray-700 dark:text-gray-300 text-lg"><strong>Purpose:</strong> Track which companies/individuals you pay for expenses. Essential for vendor analysis and expense tracking.</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Adding Vendors:</h4>
                          <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                            <li>Locate the "Vendors" section</li>
                            <li>Type vendor name (company or person you pay)</li>
                            <li>Press Enter or click the blue "+" button</li>
                            <li>Vendor appears in the scrollable list</li>
                            <li>Available immediately in expense entry forms</li>
                          </ol>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Vendor Features:</h4>
                          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                            <li><strong>Scrollable List:</strong> All vendors in organized list</li>
                            <li><strong>Delete Vendors:</strong> Red trash icon for removal</li>
                            <li><strong>Expense Assignment:</strong> Select vendors when recording expenses</li>
                            <li><strong>Reporting:</strong> Vendor spending analysis in detailed reports</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Vendor Examples by Category:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                            <h5 className="font-semibold text-purple-600 mb-2">Common Business Vendors:</h5>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Office supply stores (Staples, Office Depot)</li>
                              <li>• Software companies (Microsoft, Adobe)</li>
                              <li>• Service providers (accountants, lawyers)</li>
                              <li>• Utility companies (electric, internet)</li>
                              <li>• Equipment suppliers</li>
                              <li>• Marketing agencies</li>
                            </ul>
                          </div>
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                            <h5 className="font-semibold text-purple-600 mb-2">Vendor Benefits:</h5>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Track spending by vendor</li>
                              <li>• Identify top suppliers</li>
                              <li>• Analyze vendor relationships</li>
                              <li>• Prepare 1099 forms</li>
                              <li>• Budget planning</li>
                              <li>• Audit trail maintenance</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-8">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">💾 Data Management (Backup & Restore)</h3>
                    <div className="space-y-6">
                      <p className="text-gray-700 dark:text-gray-300 text-lg"><strong>Purpose:</strong> Protect your financial data with comprehensive backup and restore capabilities using the proprietary .dawg format.</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-indigo-200 dark:border-indigo-700">
                          <h4 className="font-semibold text-indigo-600 mb-4">📥 Download Backup Process:</h4>
                          <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                            <li>Click the blue "Download Backup" button</li>
                            <li>File automatically downloads as: [company-name]-backup-[date].dawg</li>
                            <li>Contains ALL company data: settings, income, expenses, reconciliation status</li>
                            <li>File format: .dawg (proprietary AuditThis! format)</li>
                            <li>Store backup files safely (cloud storage recommended)</li>
                          </ol>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-indigo-200 dark:border-indigo-700">
                          <h4 className="font-semibold text-indigo-600 mb-4">📤 Restore Backup Process:</h4>
                          <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                            <li>Click the green "Restore Backup" button</li>
                            <li>File browser opens - select .dawg or .json file</li>
                            <li>System validates file format</li>
                            <li>Choose to create new company or overwrite current data</li>
                            <li>All data restored: settings, transactions, categories</li>
                            <li>Success message confirms completion</li>
                          </ol>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Backup Best Practices:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                            <li>Backup weekly or after major data entry sessions</li>
                            <li>Store backups in multiple locations (local + cloud)</li>
                            <li>Test restore process periodically</li>
                            <li>Keep backups from different time periods</li>
                          </ul>
                          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                            <li>Backup before major changes or updates</li>
                            <li>Label backup files with descriptive names</li>
                            <li>Verify backup file integrity</li>
                            <li>Document backup procedures</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                        <p className="text-red-800 dark:text-red-200 text-sm"><strong>⚠️ Critical:</strong> AuditThis! stores data locally in your browser. Regular backups are essential to prevent data loss from browser issues, computer problems, or accidental deletion.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Income Tracking - Enhanced */}
              <section>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 border-b-2 border-green-500 pb-2">📈 3. Income Tracking - Complete Guide</h2>
                
                <div className="space-y-8">
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-8">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">📊 Overview Dashboard</h3>
                    <p className="text-gray-700 dark:text-gray-300 text-lg mb-6">The Income tab provides a comprehensive view of your revenue with three key statistics cards that update based on your current filters:</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-green-200 dark:border-green-700">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mr-4">
                            <span className="text-green-600 dark:text-green-400 text-xl">💰</span>
                          </div>
                          <div>
                            <p className="font-semibold text-green-600 text-lg">Total Earned</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Net income sum</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">Sum of all net income (after sales tax) from filtered entries. Updates in real-time as you apply filters.</p>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-green-200 dark:border-green-700">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-4">
                            <span className="text-blue-600 dark:text-blue-400 text-xl">📊</span>
                          </div>
                          <div>
                            <p className="font-semibold text-blue-600 text-lg">Total Entries</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Transaction count</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">Number of income transactions recorded. Useful for understanding transaction frequency and patterns.</p>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-green-200 dark:border-green-700">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-4">
                            <span className="text-purple-600 dark:text-purple-400 text-xl">💵</span>
                          </div>
                          <div>
                            <p className="font-semibold text-purple-600 text-lg">Amount Remaining</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">After expenses</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">Total income minus total expenses. Shows how much money you have left. Green when positive, red when negative.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-8">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">➕ Adding Income Entries</h3>
                    <p className="text-gray-700 dark:text-gray-300 text-lg mb-6"><strong>Location:</strong> Bottom of the Income tab - "Add New Income Entry" section</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Required Fields:</h4>
                        <div className="space-y-4">
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                            <h5 className="font-semibold text-blue-600 mb-2">📅 Date</h5>
                            <p className="text-sm text-gray-700 dark:text-gray-300">Click date field, use date picker or type YYYY-MM-DD format. Defaults to today's date.</p>
                          </div>
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                            <h5 className="font-semibold text-blue-600 mb-2">🏷️ Income Stream</h5>
                            <p className="text-sm text-gray-700 dark:text-gray-300">Select from dropdown (must be configured in Setup first). Shows "Select income stream..." if none configured.</p>
                          </div>
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                            <h5 className="font-semibold text-blue-600 mb-2">💰 Total Income</h5>
                            <p className="text-sm text-gray-700 dark:text-gray-300">Enter gross amount received (before taxes). Supports decimal values (e.g., 1234.56).</p>
                          </div>
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                            <h5 className="font-semibold text-blue-600 mb-2">🧾 Sales Tax</h5>
                            <p className="text-sm text-gray-700 dark:text-gray-300">Enter tax amount collected (optional, defaults to 0). Used for tax reporting.</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Process & Features:</h4>
                        <div className="space-y-4">
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                            <h5 className="font-semibold text-green-600 mb-2">🔢 Automatic Calculations</h5>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Net Income = Total Income - Sales Tax</li>
                              <li>• Green preview box shows calculated net income</li>
                              <li>• Updates in real-time as you type</li>
                            </ul>
                          </div>
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                            <h5 className="font-semibold text-green-600 mb-2">✅ Validation</h5>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Entry only saves if date, stream, and total income provided</li>
                              <li>• "Add Entry" button disabled until valid</li>
                              <li>• Error prevention built-in</li>
                            </ul>
                          </div>
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                            <h5 className="font-semibold text-green-600 mb-2">🔄 Entry Behavior</h5>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Entries automatically sort by date</li>
                              <li>• Form clears after successful entry</li>
                              <li>• Date defaults to today for next entry</li>
                              <li>• Unique ID assigned automatically</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-8">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">✏️ Managing Existing Entries</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Entry Display Format:</h4>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
                          <p className="text-gray-700 dark:text-gray-300 mb-4">Each entry is displayed in a rounded card format with the following information:</p>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">📅 Date</p>
                              <p className="text-gray-600 dark:text-gray-400">Transaction date</p>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">🏷️ Stream</p>
                              <p className="text-gray-600 dark:text-gray-400">Income category</p>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">💰 Total Income</p>
                              <p className="text-gray-600 dark:text-gray-400">Gross amount</p>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">🧾 Sales Tax</p>
                              <p className="text-gray-600 dark:text-gray-400">Tax collected</p>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">💵 Net Income</p>
                              <p className="text-gray-600 dark:text-gray-400">After-tax amount</p>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">🔘 Status</p>
                              <p className="text-gray-600 dark:text-gray-400">Reconciliation indicator</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Action Buttons (Right Side of Each Entry):</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                            <h5 className="font-semibold text-blue-600 mb-3">✏️ Edit Button (Blue Pencil)</h5>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                              <li>• Click to enter edit mode</li>
                              <li>• All fields become editable</li>
                              <li>• Changes save automatically</li>
                              <li>• Net income recalculates instantly</li>
                              <li>• Click again to exit edit mode</li>
                              <li>• No confirmation required</li>
                            </ul>
                          </div>
                          
                          <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
                            <h5 className="font-semibold text-purple-600 mb-3">🔀 Split Button (Purple)</h5>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                              <li>• Splits one entry into multiple</li>
                              <li>• Opens split transaction modal</li>
                              <li>• Original entry is deleted</li>
                              <li>• Multiple new entries created</li>
                              <li>• Tax proportionally distributed</li>
                              <li>• Useful for mixed payments</li>
                            </ul>
                          </div>
                          
                          <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
                            <h5 className="font-semibold text-red-600 mb-3">🗑️ Delete Button (Red Trash)</h5>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                              <li>• Permanently removes the entry</li>
                              <li>• No confirmation dialog</li>
                              <li>• Action cannot be undone</li>
                              <li>• Use with caution</li>
                              <li>• Statistics update immediately</li>
                              <li>• Consider backup before bulk deletions</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Reconciliation Status Indicators:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border flex items-center">
                            <div className="w-4 h-4 bg-gray-400 rounded-full mr-3"></div>
                            <div>
                              <p className="font-semibold text-gray-700 dark:text-gray-300">Gray: Unreconciled</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Not matched with bank statement</p>
                            </div>
                          </div>
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border flex items-center">
                            <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
                            <div>
                              <p className="font-semibold text-blue-700 dark:text-blue-300">Blue: Cleared</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Marked in reconciliation process</p>
                            </div>
                          </div>
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border flex items-center">
                            <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                            <div>
                              <p className="font-semibold text-green-700 dark:text-green-300">Green: Reconciled</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Matched with bank statement</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-8">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">🔍 Advanced Filtering & Search</h3>
                    <p className="text-gray-700 dark:text-gray-300 text-lg mb-6"><strong>Access:</strong> Click the "Filters" button (shows number of active filters when any are applied)</p>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Available Filter Options:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                              <h5 className="font-semibold text-blue-600 mb-2">📅 Date Range Filtering</h5>
                              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                <li>• <strong>Date From:</strong> Start date for filtering</li>
                                <li>• <strong>Date To:</strong> End date for filtering</li>
                                <li>• Leave blank to include all dates</li>
                                <li>• Use date picker or type YYYY-MM-DD</li>
                                <li>• Inclusive of both start and end dates</li>
                              </ul>
                            </div>
                            
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                              <h5 className="font-semibold text-green-600 mb-2">🏷️ Income Stream Filtering</h5>
                              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                <li>• Dropdown of all configured streams</li>
                                <li>• "All Income Streams" shows everything</li>
                                <li>• Select specific stream to filter</li>
                                <li>• Only shows entries from that stream</li>
                                <li>• Useful for stream-specific analysis</li>
                              </ul>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                              <h5 className="font-semibold text-purple-600 mb-2">💰 Amount Range Filtering</h5>
                              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                <li>• <strong>Min Amount:</strong> Minimum net income</li>
                                <li>• <strong>Max Amount:</strong> Maximum net income</li>
                                <li>• Filters based on net income (after tax)</li>
                                <li>• Use decimal values (e.g., 100.50)</li>
                                <li>• Useful for finding large/small transactions</li>
                              </ul>
                            </div>
                            
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                              <h5 className="font-semibold text-orange-600 mb-2">🔍 Notes Search</h5>
                              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                <li>• Search within entry notes</li>
                                <li>• Case-insensitive search</li>
                                <li>• Partial matches included</li>
                                <li>• Useful for finding specific transactions</li>
                                <li>• Searches in notes field only</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Filter Management:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                            <h5 className="font-semibold text-indigo-600 mb-2">Filter Controls</h5>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• <strong>Active Filters:</strong> Button shows count of active filters</li>
                              <li>• <strong>Clear All:</strong> "X Clear All" button removes all filters</li>
                              <li>• <strong>Hide Panel:</strong> X button in top-right closes filter panel</li>
                              <li>• <strong>Real-time:</strong> Results update as you type/select</li>
                            </ul>
                          </div>
                          
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                            <h5 className="font-semibold text-indigo-600 mb-2">Filter Results</h5>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Statistics cards update to show filtered totals</li>
                              <li>• Entry list shows only matching transactions</li>
                              <li>• "No entries match" message if no results</li>
                              <li>• "Clear filters" link to reset when no matches</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-8">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">🔀 Transaction Splitting</h3>
                    <p className="text-gray-700 dark:text-gray-300 text-lg mb-6"><strong>Purpose:</strong> Split a single income entry into multiple entries across different income streams. Perfect for mixed payments or complex transactions.</p>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">How to Split an Entry:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h5 className="font-semibold text-purple-600 mb-3">Step-by-Step Process:</h5>
                            <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                              <li>Click the purple split button (🔀) on any income entry</li>
                              <li>Split Transaction modal opens</li>
                              <li>Original transaction details pre-filled</li>
                              <li>Two split rows created by default</li>
                              <li>Modify split details as needed</li>
                              <li>Ensure totals match</li>
                              <li>Click "Create Split Entries" to complete</li>
                            </ol>
                          </div>
                          
                          <div>
                            <h5 className="font-semibold text-purple-600 mb-3">Modal Features:</h5>
                            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                              <li><strong>Date:</strong> Editable date for all split entries</li>
                              <li><strong>Total Income:</strong> Original total amount (editable)</li>
                              <li><strong>Sales Tax:</strong> Original tax amount (editable)</li>
                              <li><strong>Split Rows:</strong> Each with income stream and amount</li>
                              <li><strong>Add Split:</strong> Blue "+" button adds more rows</li>
                              <li><strong>Remove Split:</strong> Red trash icon (minimum 2 rows)</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Split Validation & Results:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                            <h5 className="font-semibold text-green-600 mb-2">✅ Validation Rules</h5>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Split amounts must equal original total</li>
                              <li>• Visual indicator: Green text when totals match</li>
                              <li>• Red text when totals are different</li>
                              <li>• Difference amount displayed if totals don't match</li>
                              <li>• Save button only enabled when totals match</li>
                            </ul>
                          </div>
                          
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                            <h5 className="font-semibold text-blue-600 mb-2">🔄 Split Results</h5>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Original entry is deleted</li>
                              <li>• New entries created for each split</li>
                              <li>• Tax proportionally distributed across splits</li>
                              <li>• Each split gets unique ID</li>
                              <li>• All splits have same date</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                        <h5 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">💡 Example Use Case:</h5>
                        <p className="text-yellow-800 dark:text-yellow-200 text-sm">A $1000 payment for "Mixed Services" could be split into $600 "Consulting Services" + $400 "Training Workshops". The $50 sales tax would be distributed proportionally: $30 to consulting and $20 to training.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Expense Tracking */}
              <section>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 border-b-2 border-red-500 pb-2">📉 4. Expense Tracking - Complete Guide</h2>
                
                <div className="space-y-8">
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">📊 Expense Dashboard</h3>
                    <p className="text-gray-700 dark:text-gray-300 text-lg mb-6">The Expense tab mirrors the Income tab structure with three key statistics cards:</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-red-200 dark:border-red-700">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mr-4">
                            <span className="text-red-600 dark:text-red-400 text-xl">💸</span>
                          </div>
                          <div>
                            <p className="font-semibold text-red-600 text-lg">Total Spent</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Net expense sum</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">Sum of all net expenses (after tax) from filtered entries. Updates in real-time with filters.</p>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-red-200 dark:border-red-700">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-4">
                            <span className="text-blue-600 dark:text-blue-400 text-xl">📊</span>
                          </div>
                          <div>
                            <p className="font-semibold text-blue-600 text-lg">Total Entries</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Transaction count</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">Number of expense transactions recorded. Helps track spending frequency.</p>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-red-200 dark:border-red-700">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-4">
                            <span className="text-purple-600 dark:text-purple-400 text-xl">💰</span>
                          </div>
                          <div>
                            <p className="font-semibold text-purple-600 text-lg">Amount Remaining</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">After expenses</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">Total income minus total expenses. Shows financial position. Green when positive, red when negative.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-8">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">➕ Recording Expenses</h3>
                    <p className="text-gray-700 dark:text-gray-300 text-lg mb-6"><strong>Location:</strong> Bottom of the Expense tab - "Add New Expense Entry" section</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Required Fields:</h4>
                        <div className="space-y-4">
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                            <h5 className="font-semibold text-orange-600 mb-2">📅 Date</h5>
                            <p className="text-sm text-gray-700 dark:text-gray-300">Transaction date. Defaults to today. Use date picker or YYYY-MM-DD format.</p>
                          </div>
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                            <h5 className="font-semibold text-orange-600 mb-2">🏷️ Category</h5>
                            <p className="text-sm text-gray-700 dark:text-gray-300">Select from expense categories configured in Setup. Required field.</p>
                          </div>
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                            <h5 className="font-semibold text-orange-600 mb-2">🏢 Vendor</h5>
                            <p className="text-sm text-gray-700 dark:text-gray-300">Select vendor from dropdown (optional). Shows "Select vendor..." if none configured.</p>
                          </div>
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                            <h5 className="font-semibold text-orange-600 mb-2">💰 Total Expense</h5>
                            <p className="text-sm text-gray-700 dark:text-gray-300">Gross amount paid (before tax deduction). Required field with currency symbol.</p>
                          </div>
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                            <h5 className="font-semibold text-orange-600 mb-2">🧾 Tax</h5>
                            <p className="text-sm text-gray-700 dark:text-gray-300">Tax amount paid (optional, defaults to 0). Used for tax deduction calculations.</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Features & Calculations:</h4>
                        <div className="space-y-4">
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                            <h5 className="font-semibold text-red-600 mb-2">🔢 Automatic Calculations</h5>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Net Expense = Total Expense - Tax</li>
                              <li>• Red preview box shows calculated net expense</li>
                              <li>• Updates in real-time as you type</li>
                              <li>• Tax represents deductible portion</li>
                            </ul>
                          </div>
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                            <h5 className="font-semibold text-red-600 mb-2">🏢 Vendor Integration</h5>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Dropdown populated from Setup vendors</li>
                              <li>• Optional field - can be left blank</li>
                              <li>• Used for vendor analysis in reports</li>
                              <li>• Helps track supplier relationships</li>
                            </ul>
                          </div>
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                            <h5 className="font-semibold text-red-600 mb-2">✅ Entry Process</h5>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• "Add" button creates the expense</li>
                              <li>• Entries sort by date automatically</li>
                              <li>• Form clears after successful entry</li>
                              <li>• Statistics update immediately</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-8">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">🔍 Expense Filtering & Management</h3>
                    <p className="text-gray-700 dark:text-gray-300 text-lg mb-6">Expense filtering includes all income filtering options plus vendor-specific filtering:</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Additional Filter Options:</h4>
                        <div className="space-y-4">
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                            <h5 className="font-semibold text-purple-600 mb-2">🏢 Vendor Filtering</h5>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Search vendors by name</li>
                              <li>• Case-insensitive partial matching</li>
                              <li>• Useful for vendor-specific analysis</li>
                              <li>• Shows all expenses for matching vendors</li>
                            </ul>
                          </div>
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                            <h5 className="font-semibold text-purple-600 mb-2">🏷️ Category Filtering</h5>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Dropdown of all expense categories</li>
                              <li>• "All Categories" shows everything</li>
                              <li>• Select specific category to filter</li>
                              <li>• Perfect for category-specific analysis</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Expense Entry Management:</h4>
                        <div className="space-y-4">
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                            <h5 className="font-semibold text-red-600 mb-2">✏️ Edit Mode</h5>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Click blue pencil to edit any field</li>
                              <li>• Vendor dropdown available in edit mode</li>
                              <li>• Category can be changed</li>
                              <li>• All calculations update automatically</li>
                            </ul>
                          </div>
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                            <h5 className="font-semibold text-red-600 mb-2">🔀 Split Transactions</h5>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Split expenses across categories</li>
                              <li>• Vendor information preserved</li>
                              <li>• Tax distributed proportionally</li>
                              <li>• Useful for mixed purchases</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Financial Overviews */}
              <section>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 border-b-2 border-purple-500 pb-2">📊 5. Financial Overviews - Monthly & Annual</h2>
                
                <div className="space-y-8">
                  <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-8">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">📅 Monthly Overview</h3>
                    <p className="text-gray-700 dark:text-gray-300 text-lg mb-6">Comprehensive monthly financial analysis with interactive charts and detailed breakdowns.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Key Features:</h4>
                        <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                          <li className="flex items-start">
                            <span className="bg-purple-100 text-purple-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">📊</span>
                            <div>
                              <strong>Summary Cards:</strong> Total income, expenses, and profit for selected month
                            </div>
                          </li>
                          <li className="flex items-start">
                            <span className="bg-purple-100 text-purple-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">📈</span>
                            <div>
                              <strong>Statistics:</strong> Transaction counts, averages, and profit margins
                            </div>
                          </li>
                          <li className="flex items-start">
                            <span className="bg-purple-100 text-purple-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">🥧</span>
                            <div>
                              <strong>Pie Charts:</strong> Visual breakdown of income streams and expense categories
                            </div>
                          </li>
                          <li className="flex items-start">
                            <span className="bg-purple-100 text-purple-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">📋</span>
                            <div>
                              <strong>Detailed Tables:</strong> Income streams and expense categories with totals
                            </div>
                          </li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Month Selection:</h4>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                            <li>• Dropdown shows available months with data</li>
                            <li>• Format: "Month Year" (e.g., "Jan 2025")</li>
                            <li>• Only months with transactions appear</li>
                            <li>• Sorted by most recent first</li>
                            <li>• All charts and tables update automatically</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-8">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">📅 Annual Overview</h3>
                    <p className="text-gray-700 dark:text-gray-300 text-lg mb-6">Comprehensive yearly financial summary with trend analysis and detailed breakdowns.</p>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Annual Features:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                            <h5 className="font-semibold text-orange-600 mb-2">📊 Year Summary</h5>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Total annual income</li>
                              <li>• Total annual expenses</li>
                              <li>• Net annual profit</li>
                              <li>• Profit margin percentage</li>
                            </ul>
                          </div>
                          
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                            <h5 className="font-semibold text-orange-600 mb-2">📈 Monthly Breakdown</h5>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Month-by-month table</li>
                              <li>• Income, expenses, profit per month</li>
                              <li>• Identify seasonal trends</li>
                              <li>• Best/worst performing months</li>
                            </ul>
                          </div>
                          
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                            <h5 className="font-semibold text-orange-600 mb-2">🥧 Visual Analysis</h5>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Annual income stream breakdown</li>
                              <li>• Annual expense category breakdown</li>
                              <li>• Percentage distributions</li>
                              <li>• Color-coded pie charts</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Annual Statistics:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                            <h5 className="font-semibold text-green-600 mb-2">📊 Performance Metrics</h5>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Highest monthly income</li>
                              <li>• Highest monthly expenses</li>
                              <li>• Best monthly profit</li>
                              <li>• Average monthly performance</li>
                            </ul>
                          </div>
                          
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                            <h5 className="font-semibold text-blue-600 mb-2">📈 Transaction Analysis</h5>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Total income entries for year</li>
                              <li>• Total expense entries for year</li>
                              <li>• Transaction frequency patterns</li>
                              <li>• Category usage statistics</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-8">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">🥧 Charts & Analytics</h3>
                    <p className="text-gray-700 dark:text-gray-300 text-lg mb-6">Interactive pie charts provide visual insights into your financial data distribution.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Income Stream Charts:</h4>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                            <li>• <strong>Visual Breakdown:</strong> Each income stream as colored segment</li>
                            <li>• <strong>Percentages:</strong> Exact percentage of total income</li>
                            <li>• <strong>Legend:</strong> Color-coded list with stream names</li>
                            <li>• <strong>Interactive:</strong> Hover for detailed information</li>
                            <li>• <strong>Empty State:</strong> "No income recorded" message when applicable</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Expense Category Charts:</h4>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                            <li>• <strong>Category Distribution:</strong> Visual expense breakdown</li>
                            <li>• <strong>Spending Patterns:</strong> Identify major expense areas</li>
                            <li>• <strong>Budget Analysis:</strong> See where money is going</li>
                            <li>• <strong>Color Coding:</strong> Consistent colors for easy recognition</li>
                            <li>• <strong>Percentage Display:</strong> Exact portion of total expenses</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Professional Reports */}
              <section>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 border-b-2 border-indigo-500 pb-2">📄 6. Professional Reports - PDF Generation</h2>
                
                <div className="space-y-8">
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-8">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">📋 Report Types Overview</h3>
                    <p className="text-gray-700 dark:text-gray-300 text-lg mb-6">Generate professional PDF reports for accountants, tax purposes, and business analysis.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-indigo-200 dark:border-indigo-700">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-4">
                            <span className="text-blue-600 dark:text-blue-400 text-xl">📅</span>
                          </div>
                          <div>
                            <p className="font-semibold text-blue-600 text-lg">Monthly Reports</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Detailed monthly analysis</p>
                          </div>
                        </div>
                        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                          <li>• Financial summary for specific month</li>
                          <li>• Income and expense breakdowns</li>
                          <li>• Simple or detailed versions</li>
                          <li>• Vendor analysis (detailed mode)</li>
                        </ul>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-indigo-200 dark:border-indigo-700">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-4">
                            <span className="text-purple-600 dark:text-purple-400 text-xl">📊</span>
                          </div>
                          <div>
                            <p className="font-semibold text-purple-600 text-lg">Annual Reports</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Comprehensive yearly summary</p>
                          </div>
                        </div>
                        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                          <li>• Full year financial overview</li>
                          <li>• Month-by-month breakdown</li>
                          <li>• Category analysis</li>
                          <li>• Vendor spending analysis</li>
                        </ul>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-indigo-200 dark:border-indigo-700">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mr-4">
                            <span className="text-green-600 dark:text-green-400 text-xl">📈</span>
                          </div>
                          <div>
                            <p className="font-semibold text-green-600 text-lg">P&L Statements</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Professional profit & loss</p>
                          </div>
                        </div>
                        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                          <li>• Standard accounting format</li>
                          <li>• Revenue and expense sections</li>
                          <li>• Net income calculations</li>
                          <li>• Profit margin analysis</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-8">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">📝 Report Generation Process</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Step-by-Step Process:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h5 className="font-semibold text-blue-600 mb-3">1. Report Selection</h5>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Navigate to Reports tab</li>
                              <li>• Choose report type (Monthly, Annual, P&L)</li>
                              <li>• Select report format (Simple or Detailed)</li>
                              <li>• Choose date range or specific period</li>
                            </ul>
                          </div>
                          
                          <div>
                            <h5 className="font-semibold text-blue-600 mb-3">2. Configuration</h5>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Select year from available years</li>
                              <li>• Choose month (for monthly reports)</li>
                              <li>• Review summary statistics</li>
                              <li>• Verify data completeness</li>
                            </ul>
                          </div>
                          
                          <div>
                            <h5 className="font-semibold text-blue-600 mb-3">3. Generation</h5>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Click "Generate" or "Download" button</li>
                              <li>• System processes all data</li>
                              <li>• PDF created with professional formatting</li>
                              <li>• File automatically downloads</li>
                            </ul>
                          </div>
                          
                          <div>
                            <h5 className="font-semibold text-blue-600 mb-3">4. File Output</h5>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Descriptive filename with date</li>
                              <li>• Professional PDF formatting</li>
                              <li>• Company information included</li>
                              <li>• Page numbers and generation date</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-8">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">📊 Report Content & Features</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Standard Report Elements:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                            <h5 className="font-semibold text-green-600 mb-2">📋 Header Information</h5>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Company name and report title</li>
                              <li>• Report period (month/year)</li>
                              <li>• Generation date and time</li>
                              <li>• Page numbers on multi-page reports</li>
                            </ul>
                          </div>
                          
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                            <h5 className="font-semibold text-green-600 mb-2">📊 Financial Summary</h5>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Total income and expenses</li>
                              <li>• Net profit/loss</li>
                              <li>• Profit margin percentage</li>
                              <li>• Key performance indicators</li>
                            </ul>
                          </div>
                          
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                            <h5 className="font-semibold text-green-600 mb-2">📋 Detailed Breakdowns</h5>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Income by stream/category</li>
                              <li>• Expenses by category</li>
                              <li>• Transaction-level details</li>
                              <li>• Tax information</li>
                            </ul>
                          </div>
                          
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                            <h5 className="font-semibold text-green-600 mb-2">🏢 Vendor Analysis (Detailed)</h5>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Spending by vendor</li>
                              <li>• Transaction counts</li>
                              <li>• Average transaction amounts</li>
                              <li>• Top vendor rankings</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Simple vs Detailed Reports:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                            <h5 className="font-semibold text-blue-600 mb-2">📄 Simple Reports</h5>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Essential financial information only</li>
                              <li>• Summary tables and totals</li>
                              <li>• Faster generation</li>
                              <li>• Perfect for quick reviews</li>
                              <li>• Ideal for internal use</li>
                            </ul>
                          </div>
                          
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                            <h5 className="font-semibold text-purple-600 mb-2">📊 Detailed Reports</h5>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Comprehensive vendor analysis</li>
                              <li>• Transaction-level details</li>
                              <li>• Extended statistical analysis</li>
                              <li>• Perfect for accountants</li>
                              <li>• Tax preparation ready</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Invoice Management */}
              <section>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 border-b-2 border-teal-500 pb-2">🧾 7. Invoice Management - Professional Invoicing</h2>
                
                <div className="space-y-8">
                  <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl p-8">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">📋 Invoice Creation Overview</h3>
                    <p className="text-gray-700 dark:text-gray-300 text-lg mb-6">Create professional invoices with automatic calculations, tax handling, and PDF export capabilities.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-teal-200 dark:border-teal-700">
                        <h4 className="font-semibold text-teal-600 mb-4">📝 Invoice Details</h4>
                        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                          <li>• Invoice number assignment</li>
                          <li>• Issue and due dates</li>
                          <li>• Professional formatting</li>
                          <li>• Automatic calculations</li>
                        </ul>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-teal-200 dark:border-teal-700">
                        <h4 className="font-semibold text-teal-600 mb-4">👥 Contact Management</h4>
                        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                          <li>• Business information section</li>
                          <li>• Client information section</li>
                          <li>• Address management</li>
                          <li>• Contact details storage</li>
                        </ul>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-teal-200 dark:border-teal-700">
                        <h4 className="font-semibold text-teal-600 mb-4">💰 Financial Features</h4>
                        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                          <li>• Line item management</li>
                          <li>• Tax calculations</li>
                          <li>• Subtotal and total calculations</li>
                          <li>• Currency formatting</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-8">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">📝 Invoice Creation Process</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Step 1: Invoice Header Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                            <h5 className="font-semibold text-blue-600 mb-2">📄 Invoice Number</h5>
                            <p className="text-sm text-gray-700 dark:text-gray-300">Unique identifier for the invoice (e.g., INV-001, 2025-001)</p>
                          </div>
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                            <h5 className="font-semibold text-blue-600 mb-2">📅 Issue Date</h5>
                            <p className="text-sm text-gray-700 dark:text-gray-300">Date the invoice is created (defaults to today)</p>
                          </div>
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                            <h5 className="font-semibold text-blue-600 mb-2">⏰ Due Date</h5>
                            <p className="text-sm text-gray-700 dark:text-gray-300">Payment due date (defaults to 30 days from issue)</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Step 2: Business Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                            <h5 className="font-semibold text-green-600 mb-2">🏢 Your Business Details</h5>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Business name</li>
                              <li>• Business address (multi-line)</li>
                              <li>• Business email</li>
                              <li>• Business phone number</li>
                            </ul>
                          </div>
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                            <h5 className="font-semibold text-purple-600 mb-2">👤 Client Information</h5>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Client name</li>
                              <li>• Client email</li>
                              <li>• Client address (multi-line)</li>
                              <li>• Additional contact information</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Step 3: Invoice Items Management</h4>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
                          <div className="space-y-4">
                            <div>
                              <h5 className="font-semibold text-indigo-600 mb-2">📋 Line Item Fields</h5>
                              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <p className="font-semibold text-gray-900 dark:text-white">Description</p>
                                  <p className="text-gray-600 dark:text-gray-400">Service or product description</p>
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900 dark:text-white">Quantity</p>
                                  <p className="text-gray-600 dark:text-gray-400">Number of units</p>
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900 dark:text-white">Rate</p>
                                  <p className="text-gray-600 dark:text-gray-400">Price per unit</p>
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900 dark:text-white">Amount</p>
                                  <p className="text-gray-600 dark:text-gray-400">Quantity × Rate (auto-calculated)</p>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h5 className="font-semibold text-indigo-600 mb-2">⚙️ Item Management</h5>
                              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                <li>• <strong>Add Items:</strong> Blue "+" button adds new line items</li>
                                <li>• <strong>Remove Items:</strong> Red trash icon removes items (minimum 1 item)</li>
                                <li>• <strong>Auto-calculation:</strong> Amount updates when quantity or rate changes</li>
                                <li>• <strong>Real-time totals:</strong> Subtotal and total update automatically</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-8">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">💰 Tax Calculations & Totals</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Automatic Calculations:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                            <h5 className="font-semibold text-green-600 mb-2">📊 Subtotal</h5>
                            <p className="text-sm text-gray-700 dark:text-gray-300">Sum of all line item amounts (Quantity × Rate for each item)</p>
                          </div>
                          
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                            <h5 className="font-semibold text-green-600 mb-2">🧾 Tax Amount</h5>
                            <p className="text-sm text-gray-700 dark:text-gray-300">Calculated as: Subtotal × (Tax Rate ÷ 100). Tax rate is adjustable.</p>
                          </div>
                          
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                            <h5 className="font-semibold text-green-600 mb-2">💰 Total</h5>
                            <p className="text-sm text-gray-700 dark:text-gray-300">Final amount: Subtotal + Tax Amount. This is the amount due.</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Tax Rate Management:</h4>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h5 className="font-semibold text-blue-600 mb-2">⚙️ Tax Rate Input</h5>
                              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                <li>• Adjustable tax rate field in invoice summary</li>
                                <li>• Accepts decimal values (e.g., 8.5 for 8.5%)</li>
                                <li>• Range: 0% to 100%</li>
                                <li>• Updates tax amount in real-time</li>
                              </ul>
                            </div>
                            
                            <div>
                              <h5 className="font-semibold text-blue-600 mb-2">🔄 Real-time Updates</h5>
                              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                <li>• Tax amount recalculates instantly</li>
                                <li>• Total amount updates automatically</li>
                                <li>• Visual feedback with updated totals</li>
                                <li>• Currency formatting applied</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-8">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">📄 PDF Export & Features</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">PDF Generation Process:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h5 className="font-semibold text-purple-600 mb-3">📋 Requirements</h5>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Client name must be filled</li>
                              <li>• At least one line item required</li>
                              <li>• Valid amounts in all fields</li>
                              <li>• Download button enabled when valid</li>
                            </ul>
                          </div>
                          
                          <div>
                            <h5 className="font-semibold text-purple-600 mb-3">⚡ Generation Process</h5>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Click "Download PDF" button</li>
                              <li>• System generates professional PDF</li>
                              <li>• File downloads automatically</li>
                              <li>• Filename: Invoice-[Number].pdf</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">PDF Content & Formatting:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                            <h5 className="font-semibold text-indigo-600 mb-2">📋 Header Section</h5>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Large "INVOICE" title</li>
                              <li>• Invoice number, date, due date</li>
                              <li>• Professional typography</li>
                              <li>• Consistent spacing and alignment</li>
                            </ul>
                          </div>
                          
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                            <h5 className="font-semibold text-indigo-600 mb-2">👥 Contact Information</h5>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• "From:" section with business details</li>
                              <li>• "Bill To:" section with client details</li>
                              <li>• Proper address formatting</li>
                              <li>• Contact information display</li>
                            </ul>
                          </div>
                          
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                            <h5 className="font-semibold text-indigo-600 mb-2">📊 Items Table</h5>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Professional table formatting</li>
                              <li>• Description, Qty, Rate, Amount columns</li>
                              <li>• Proper alignment and spacing</li>
                              <li>• Currency formatting throughout</li>
                            </ul>
                          </div>
                          
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                            <h5 className="font-semibold text-indigo-600 mb-2">💰 Totals Section</h5>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Subtotal, tax, and total amounts</li>
                              <li>• Right-aligned for easy reading</li>
                              <li>• Bold formatting for total</li>
                              <li>• Tax percentage display</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Additional Features:</h4>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h5 className="font-semibold text-green-600 mb-2">📝 Notes Section</h5>
                              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                <li>• Optional notes field</li>
                                <li>• Payment terms and conditions</li>
                                <li>• Additional instructions</li>
                                <li>• Multi-line support</li>
                              </ul>
                            </div>
                            
                            <div>
                              <h5 className="font-semibold text-green-600 mb-2">🔄 Invoice Management</h5>
                              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                <li>• "New Invoice" button clears form</li>
                                <li>• Form validation prevents errors</li>
                                <li>• Real-time calculation updates</li>
                                <li>• Professional appearance</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Bank Reconciliation */}
              <section>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 border-b-2 border-cyan-500 pb-2">✅ 8. Bank Reconciliation - QB-Style Process</h2>
                
                <div className="space-y-8">
                  <div className="bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 rounded-xl p-8">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">🏦 Reconciliation Overview</h3>
                    <p className="text-gray-700 dark:text-gray-300 text-lg mb-6">Professional bank statement reconciliation process similar to QB, ensuring your records match your bank statements.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-cyan-200 dark:border-cyan-700">
                        <h4 className="font-semibold text-cyan-600 mb-4">🎯 Purpose</h4>
                        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                          <li>• Verify transactions match bank records</li>
                          <li>• Identify discrepancies</li>
                          <li>• Ensure accurate financial records</li>
                          <li>• Prepare for audits</li>
                        </ul>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-cyan-200 dark:border-cyan-700">
                        <h4 className="font-semibold text-cyan-600 mb-4">⚙️ Process</h4>
                        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                          <li>• Set reconciliation period</li>
                          <li>• Enter opening/ending balances</li>
                          <li>• Mark transactions as reconciled</li>
                          <li>• Verify balance matches</li>
                        </ul>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-cyan-200 dark:border-cyan-700">
                        <h4 className="font-semibold text-cyan-600 mb-4">📊 Results</h4>
                        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                          <li>• Balanced reconciliation</li>
                          <li>• Updated transaction status</li>
                          <li>• Reconciliation reports</li>
                          <li>• Audit trail maintenance</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-8">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">🚀 Starting a Reconciliation</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Setup Phase:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
                            <h5 className="font-semibold text-blue-600 mb-3">📅 Date Range Selection</h5>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                              <li>• <strong>Start Date:</strong> Beginning of reconciliation period</li>
                              <li>• <strong>End Date:</strong> End of reconciliation period (usually statement date)</li>
                              <li>• <strong>Default:</strong> Start date from last reconciliation or settings start date</li>
                              <li>• <strong>Flexibility:</strong> Adjust dates as needed for your statement period</li>
                            </ul>
                          </div>
                          
                          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
                            <h5 className="font-semibold text-blue-600 mb-3">💰 Balance Information</h5>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                              <li>• <strong>Opening Balance:</strong> Starting balance from bank statement</li>
                              <li>• <strong>Ending Balance:</strong> Ending balance from bank statement</li>
                              <li>• <strong>Accuracy:</strong> Must match your bank statement exactly</li>
                              <li>• <strong>Currency:</strong> Uses your configured currency format</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Starting the Process:</h4>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
                          <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
                            <li><strong>Navigate to Reconciliation tab</strong> - Click the "Reconciliation" tab in the main navigation</li>
                            <li><strong>Configure date range</strong> - Set start and end dates to match your bank statement period</li>
                            <li><strong>Enter opening balance</strong> - Input the starting balance from your bank statement</li>
                            <li><strong>Enter ending balance</strong> - Input the ending balance from your bank statement</li>
                            <li><strong>Click "Start Reconciliation"</strong> - Begin the reconciliation process</li>
                          </ol>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-8">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">✅ Reconciliation Process</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Active Reconciliation Interface:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
                            <h5 className="font-semibold text-green-600 mb-3">📊 Summary Dashboard</h5>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                              <li>• <strong>Opening Balance:</strong> Starting amount</li>
                              <li>• <strong>Reconciled Income:</strong> Matched income transactions</li>
                              <li>• <strong>Reconciled Expenses:</strong> Matched expense transactions</li>
                              <li>• <strong>Calculated Balance:</strong> Opening + Income - Expenses</li>
                              <li>• <strong>Difference:</strong> Calculated vs. Statement balance</li>
                            </ul>
                          </div>
                          
                          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
                            <h5 className="font-semibold text-green-600 mb-3">🔍 Transaction Filtering</h5>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                              <li>• <strong>Show Reconciled:</strong> Display already matched transactions</li>
                              <li>• <strong>Show Unreconciled:</strong> Display unmatched transactions</li>
                              <li>• <strong>Search:</strong> Find specific transactions by description or notes</li>
                              <li>• <strong>Real-time filtering:</strong> Results update as you type</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Transaction Matching:</h4>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
                          <div className="space-y-4">
                            <div>
                              <h5 className="font-semibold text-blue-600 mb-2">✅ Marking Transactions</h5>
                              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                <li>• Click the checkbox next to each transaction that appears on your bank statement</li>
                                <li>• Checked transactions turn green and are marked as reconciled</li>
                                <li>• Unchecked transactions remain unreconciled</li>
                                <li>• Summary totals update in real-time as you check/uncheck</li>
                              </ul>
                            </div>
                            
                            <div>
                              <h5 className="font-semibold text-blue-600 mb-2">📝 Bank Reference Numbers</h5>
                              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                <li>• Add bank reference numbers in the "Bank Ref" column</li>
                                <li>• Helps match transactions with bank statement entries</li>
                                <li>• Useful for audit trails and future reference</li>
                                <li>• Optional but recommended for thorough record-keeping</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Balance Verification:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                            <h5 className="font-semibold text-green-600 mb-2">✅ Balanced State</h5>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Difference shows $0.00 (or very close)</li>
                              <li>• Summary card shows green "Balanced ✓"</li>
                              <li>• "Finish Reconciliation" button becomes enabled</li>
                              <li>• Ready to complete the reconciliation</li>
                            </ul>
                          </div>
                          
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                            <h5 className="font-semibold text-red-600 mb-2">❌ Out of Balance</h5>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Difference shows non-zero amount</li>
                              <li>• Summary card shows red "Out of Balance"</li>
                              <li>• "Finish Reconciliation" button disabled</li>
                              <li>• Need to find and resolve discrepancies</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-8">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">📊 Reconciliation Reports</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Report Generation:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
                            <h5 className="font-semibold text-purple-600 mb-3">📄 Report Contents</h5>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                              <li>• Reconciliation period and summary</li>
                              <li>• Opening and ending balances</li>
                              <li>• Reconciled income and expense totals</li>
                              <li>• List of unreconciled transactions</li>
                              <li>• Difference analysis</li>
                              <li>• Generation date and company info</li>
                            </ul>
                          </div>
                          
                          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
                            <h5 className="font-semibold text-purple-600 mb-3">📥 Export Features</h5>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                              <li>• Professional PDF format</li>
                              <li>• Automatic filename with date range</li>
                              <li>• Suitable for accountants and auditors</li>
                              <li>• Available during and after reconciliation</li>
                              <li>• Includes company branding</li>
                              <li>• Multi-page support for large datasets</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Completing Reconciliation:</h4>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
                          <div className="space-y-4">
                            <div>
                              <h5 className="font-semibold text-green-600 mb-2">✅ Successful Completion</h5>
                              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                <li>• Click "Finish Reconciliation" when balanced</li>
                                <li>• All reconciled transactions marked as "cleared"</li>
                                <li>• Last reconciliation date updated in settings</li>
                                <li>• Opening balance set for next reconciliation</li>
                                <li>• Success confirmation message displayed</li>
                              </ul>
                            </div>
                            
                            <div>
                              <h5 className="font-semibold text-blue-600 mb-2">🔄 Ongoing Process</h5>
                              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                <li>• Regular reconciliation recommended (monthly)</li>
                                <li>• Previous reconciliation data preserved</li>
                                <li>• Transaction status indicators updated</li>
                                <li>• Audit trail maintained for all changes</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Advanced Features */}
              <section>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 border-b-2 border-orange-500 pb-2">🔧 9. Advanced Features & Tips</h2>
                
                <div className="space-y-8">
                  <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-8">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">🏢 Multi-Company Support</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Company Management Features:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
                            <h5 className="font-semibold text-orange-600 mb-3">🏗️ Company Creation</h5>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                              <li>• Unlimited companies supported</li>
                              <li>• Each company has separate data</li>
                              <li>• Independent settings and configurations</li>
                              <li>• Separate backup files per company</li>
                              <li>• Individual reconciliation tracking</li>
                            </ul>
                          </div>
                          
                          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
                            <h5 className="font-semibold text-orange-600 mb-3">🔄 Company Switching</h5>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                              <li>• Instant switching between companies</li>
                              <li>• All data updates immediately</li>
                              <li>• Settings preserved per company</li>
                              <li>• No data mixing between companies</li>
                              <li>• Active company clearly indicated</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Use Cases for Multiple Companies:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                            <h5 className="font-semibold text-blue-600 mb-2">🏪 Multiple Businesses</h5>
                            <p className="text-sm text-gray-700 dark:text-gray-300">Track finances for different business entities separately</p>
                          </div>
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                            <h5 className="font-semibold text-green-600 mb-2">📊 Client Management</h5>
                            <p className="text-sm text-gray-700 dark:text-gray-300">Manage finances for multiple clients as an accountant</p>
                          </div>
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                            <h5 className="font-semibold text-purple-600 mb-2">🏠 Personal vs Business</h5>
                            <p className="text-sm text-gray-700 dark:text-gray-300">Separate personal and business financial tracking</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-8">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">💾 Data Import/Export</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Backup System:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
                            <h5 className="font-semibold text-blue-600 mb-3">📥 Export Capabilities</h5>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                              <li>• .dawg format (proprietary)</li>
                              <li>• JSON format support</li>
                              <li>• Complete data export</li>
                              <li>• Company-specific backups</li>
                              <li>• Timestamped filenames</li>
                              <li>• Metadata included</li>
                            </ul>
                          </div>
                          
                          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
                            <h5 className="font-semibold text-blue-600 mb-3">📤 Import Features</h5>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                              <li>• Restore from .dawg files</li>
                              <li>• JSON file import</li>
                              <li>• Data validation on import</li>
                              <li>• Option to create new company</li>
                              <li>• Overwrite existing data option</li>
                              <li>• Error handling and recovery</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Best Practices:</h4>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h5 className="font-semibold text-green-600 mb-2">📅 Regular Backups</h5>
                              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                <li>• Weekly backup schedule recommended</li>
                                <li>• Before major data entry sessions</li>
                                <li>• Prior to software updates</li>
                                <li>• After reconciliation completion</li>
                              </ul>
                            </div>
                            
                            <div>
                              <h5 className="font-semibold text-green-600 mb-2">🗂️ File Management</h5>
                              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                <li>• Descriptive filename conventions</li>
                                <li>• Multiple storage locations</li>
                                <li>• Cloud storage integration</li>
                                <li>• Version control for backups</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-8">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">⌨️ Keyboard Shortcuts & Efficiency</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Navigation Shortcuts:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
                            <h5 className="font-semibold text-green-600 mb-3">⌨️ Form Navigation</h5>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                              <li>• <strong>Tab:</strong> Move to next field</li>
                              <li>• <strong>Shift+Tab:</strong> Move to previous field</li>
                              <li>• <strong>Enter:</strong> Submit forms (where applicable)</li>
                              <li>• <strong>Escape:</strong> Close modals and dialogs</li>
                            </ul>
                          </div>
                          
                          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
                            <h5 className="font-semibold text-green-600 mb-3">🖱️ Interface Tips</h5>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                              <li>• Click outside modals to close them</li>
                              <li>• Use date picker for accurate dates</li>
                              <li>• Dropdown menus support typing</li>
                              <li>• Real-time validation feedback</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Efficiency Tips:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                            <h5 className="font-semibold text-blue-600 mb-2">⚡ Quick Entry</h5>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Use Enter key to add entries</li>
                              <li>• Form clears automatically</li>
                              <li>• Date defaults to today</li>
                              <li>• Previous selections remembered</li>
                            </ul>
                          </div>
                          
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                            <h5 className="font-semibold text-purple-600 mb-2">🔍 Smart Filtering</h5>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Real-time filter updates</li>
                              <li>• Multiple filter combinations</li>
                              <li>• Clear all filters quickly</li>
                              <li>• Filter status indicators</li>
                            </ul>
                          </div>
                          
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                            <h5 className="font-semibold text-orange-600 mb-2">📊 Bulk Operations</h5>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Split transactions efficiently</li>
                              <li>• Batch reconciliation</li>
                              <li>• Multiple entry editing</li>
                              <li>• Category management</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">🔧 Troubleshooting & Support</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Common Issues & Solutions:</h4>
                        <div className="space-y-4">
                          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
                            <h5 className="font-semibold text-red-600 mb-3">💾 Data Not Saving</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Possible Causes:</p>
                                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                  <li>• Browser storage full</li>
                                  <li>• Private/incognito mode</li>
                                  <li>• Browser settings blocking storage</li>
                                  <li>• Corrupted local storage</li>
                                </ul>
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Solutions:</p>
                                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                  <li>• Clear browser cache</li>
                                  <li>• Use regular browser mode</li>
                                  <li>• Check browser storage settings</li>
                                  <li>• Try different browser</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
                            <h5 className="font-semibold text-red-600 mb-3">🔄 Performance Issues</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Symptoms:</p>
                                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                  <li>• Slow loading times</li>
                                  <li>• Unresponsive interface</li>
                                  <li>• Delayed calculations</li>
                                  <li>• Browser freezing</li>
                                </ul>
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Solutions:</p>
                                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                  <li>• Close other browser tabs</li>
                                  <li>• Restart browser</li>
                                  <li>• Clear browser cache</li>
                                  <li>• Use filters to reduce data load</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
                            <h5 className="font-semibold text-red-600 mb-3">📊 Report Generation Errors</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Common Issues:</p>
                                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                  <li>• PDF generation fails</li>
                                  <li>• Missing data in reports</li>
                                  <li>• Formatting problems</li>
                                  <li>• Download not starting</li>
                                </ul>
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Solutions:</p>
                                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                  <li>• Check browser popup blockers</li>
                                  <li>• Verify data exists for period</li>
                                  <li>• Try different date ranges</li>
                                  <li>• Refresh page and retry</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Data Recovery:</h4>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
                          <div className="space-y-4">
                            <div>
                              <h5 className="font-semibold text-yellow-600 mb-2">⚠️ If Data is Lost</h5>
                              <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                                <li>Don't panic - check if you're in the correct company</li>
                                <li>Verify you're not in private/incognito mode</li>
                                <li>Check if you have recent backup files (.dawg)</li>
                                <li>Try refreshing the browser page</li>
                                <li>Restore from most recent backup if available</li>
                                <li>Contact support if data cannot be recovered</li>
                              </ol>
                            </div>
                            
                            <div>
                              <h5 className="font-semibold text-green-600 mb-2">✅ Prevention</h5>
                              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                <li>• Regular backups (weekly recommended)</li>
                                <li>• Multiple backup locations</li>
                                <li>• Test restore process periodically</li>
                                <li>• Avoid private browsing for regular use</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Support */}
              <section>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 border-b-2 border-gray-500 pb-2">📞 Support & Additional Resources</h2>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">📚 Additional Help</h3>
                      <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                        <li className="flex items-start">
                          <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">💡</span>
                          <div>
                            <strong>Tooltips:</strong> Hover over interface elements for helpful tips
                          </div>
                        </li>
                        <li className="flex items-start">
                          <span className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">📋</span>
                          <div>
                            <strong>Form Validation:</strong> Real-time feedback prevents errors
                          </div>
                        </li>
                        <li className="flex items-start">
                          <span className="bg-purple-100 text-purple-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">🎯</span>
                          <div>
                            <strong>Context Help:</strong> Each section includes guidance text
                          </div>
                        </li>
                        <li className="flex items-start">
                          <span className="bg-orange-100 text-orange-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">📊</span>
                          <div>
                            <strong>Demo Data:</strong> Use Demo Company to explore features
                          </div>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">🎯 Best Practices</h3>
                      <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                        <li className="flex items-start">
                          <span className="bg-red-100 text-red-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">💾</span>
                          <div>
                            <strong>Regular Backups:</strong> Weekly backups prevent data loss
                          </div>
                        </li>
                        <li className="flex items-start">
                          <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">📝</span>
                          <div>
                            <strong>Consistent Entry:</strong> Regular data entry maintains accuracy
                          </div>
                        </li>
                        <li className="flex items-start">
                          <span className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">✅</span>
                          <div>
                            <strong>Monthly Reconciliation:</strong> Keep records synchronized
                          </div>
                        </li>
                        <li className="flex items-start">
                          <span className="bg-yellow-100 text-yellow-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">🏷️</span>
                          <div>
                            <strong>Proper Categorization:</strong> Accurate categories improve reporting
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">🚀 Getting the Most from AuditThis!</h3>
                    <p className="text-blue-700 dark:text-blue-300 text-sm">
                      AuditThis! is designed to be intuitive and powerful. Take time to explore each feature, use the Demo Company to practice, 
                      and establish a regular routine for data entry and reconciliation. The more consistently you use the application, 
                      the more valuable insights you'll gain about your business finances.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 dark:bg-gray-700 px-8 py-6 border-t border-gray-200 dark:border-gray-600">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">AuditThis! - Professional Financial Tracking</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Complete user manual covering all features and functionality</p>
              </div>
              <button
                onClick={() => setShowUserManual(false)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium"
              >
                Close Manual
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default Setup;