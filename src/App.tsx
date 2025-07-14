import { useState, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useCompanyManager } from './hooks/useCompanyManager';
import { AppSettings, IncomeEntry, ExpenseEntry, AppData } from './types';
import Navigation from './components/Navigation';
import FirstTimeSetup from './components/FirstTimeSetup';
import Setup from './components/Setup';
import IncomeLog from './components/IncomeLog';
import ExpenseLog from './components/ExpenseLog';
import MonthlyOverview from './components/MonthlyOverview';
import AnnualOverview from './components/AnnualOverview';
import Reports from './components/Reports';
import Invoices from './components/Invoices';
import BankReconciliation from './components/BankReconciliation';

const defaultSettings: AppSettings = {
  currency: '$',
  startDate: '2025-01-01',
  incomeStreams: [],
  expenseCategories: [],
  vendors: [],
};

const defaultIncomeEntries: IncomeEntry[] = [];

const defaultExpenseEntries: ExpenseEntry[] = [];

// Demo data for the first company only
const demoSettings: AppSettings = {
  currency: '$',
  startDate: '2025-01-01',
  incomeStreams: [
    { id: '1', name: 'Hair Services', isActive: true },
    { id: '2', name: 'Product Sales', isActive: true },
  ],
  expenseCategories: [
    { id: '1', name: 'Color Tubes', isActive: true },
    { id: '2', name: 'Shear Sharpening', isActive: true },
    { id: '3', name: 'Hair Tools', isActive: true },
    { id: '4', name: 'Advertising', isActive: true },
    { id: '5', name: 'IT equipment', isActive: true },
    { id: '6', name: 'Office supplies', isActive: true },
    { id: '7', name: 'Other', isActive: true },
  ],
  vendors: [
    { id: '1', name: 'BCS Beauty', isActive: true },
    { id: '2', name: 'CosmoProf', isActive: true },
    { id: '3', name: 'Sally Beauty', isActive: true },
  ],
};

const demoIncomeEntries: IncomeEntry[] = [
  {
    id: '1',
    date: '2025-01-17',
    category: 'Hair Services',
    totalIncome: 2800,
    salesTax: 170,
    netIncome: 2630,
    notes: '',
  },
  {
    id: '2',
    date: '2025-01-30',
    category: 'Product Sales',
    totalIncome: 3045,
    salesTax: 185,
    netIncome: 2860,
    notes: '',
  },
];

const demoExpenseEntries: ExpenseEntry[] = [
  {
    id: '1',
    date: '2025-01-06',
    category: 'Color Tubes',
    totalExpense: 120,
    tax: 7.8,
    netExpense: 112.2,
    notes: '',
  },
  {
    id: '2',
    date: '2025-01-06',
    category: 'Hair Tools',
    totalExpense: 240,
    tax: 9.1,
    netExpense: 230.9,
    notes: '',
  },
  {
    id: '3',
    date: '2025-01-06',
    category: 'Office supplies',
    totalExpense: 80,
    tax: 5.2,
    netExpense: 74.8,
    notes: '',
  },
  {
    id: '4',
    date: '2025-01-07',
    category: 'Color Tubes',
    totalExpense: 75,
    tax: 4.875,
    netExpense: 70.13,
    notes: '',
  },
  {
    id: '5',
    date: '2025-01-07',
    category: 'IT equipment',
    totalExpense: 175,
    tax: 4.875,
    netExpense: 170.13,
    notes: '',
  },
  {
    id: '6',
    date: '2025-01-09',
    category: 'Shear Sharpening',
    totalExpense: 155,
    tax: 3.575,
    netExpense: 151.43,
    notes: '',
  },
];

function App() {
  const [activeTab, setActiveTab] = useState('home');
  
  const {
    companies,
    activeCompany,
    isFirstTime,
    isLoading,
    createCompany,
    switchCompany,
    deleteCompany,
    completeFirstTimeSetup,
    downloadCompanyBackup,
    restoreCompanyBackup,
    isDemoCompany
  } = useCompanyManager();

  // Determine initial data based on company type
  const getInitialData = () => {
    if (!activeCompany) {
      return {
        settings: defaultSettings,
        income: defaultIncomeEntries,
        expenses: defaultExpenseEntries
      };
    }
    
    if (isDemoCompany(activeCompany.id)) {
      return {
        settings: demoSettings,
        income: demoIncomeEntries,
        expenses: demoExpenseEntries
      };
    }
    
    return {
      settings: defaultSettings,
      income: defaultIncomeEntries,
      expenses: defaultExpenseEntries
    };
  };

  const initialData = getInitialData();
  const [settings, setSettings] = useLocalStorage<AppSettings>('auditthis-settings', initialData.settings, activeCompany?.id);
  const [income, setIncome] = useLocalStorage<IncomeEntry[]>('auditthis-income', initialData.income, activeCompany?.id);
  const [expenses, setExpenses] = useLocalStorage<ExpenseEntry[]>('auditthis-expenses', initialData.expenses, activeCompany?.id);

  // Function declarations - moved before any usage
  const handleCreateCompany = (name: string) => {
    return createCompany(name);
  };

  const handleDownloadBackup = () => {
    if (activeCompany) {
      downloadCompanyBackup(appData, activeCompany);
    }
  };

  const handleRestoreBackup = async (file: File) => {
    try {
      const restoredData = await restoreCompanyBackup(file);
      handleDataRestore(restoredData.data);
      alert('Backup restored successfully!');
    } catch (error) {
      alert('Failed to restore backup: ' + (error as Error).message);
    }
  };

  const appData: AppData = {
    settings,
    income,
    expenses,
  };

  const handleDataRestore = (data: AppData & { company?: any }) => {
    if (data.company && data.company.id !== activeCompany?.id) {
      // This is a company backup, ask user if they want to create a new company or overwrite current
      const shouldCreateNew = confirm(
        `This backup is for "${data.company.name}". Would you like to create a new company? ` +
        `Click OK to create new company, or Cancel to overwrite current company data.`
      );
      
      if (shouldCreateNew) {
        // Create new company with backup data
        const newCompany = createCompany(data.company.name);
        // The data will be loaded automatically due to the company switch
        setTimeout(() => {
          setSettings(data.settings);
          setIncome(data.income);
          setExpenses(data.expenses);
        }, 100);
      } else {
        // Overwrite current company data
        setSettings(data.settings);
        setIncome(data.income);
        setExpenses(data.expenses);
      }
    } else {
      // Regular data restore for current company
      setSettings(data.settings);
      setIncome(data.income);
      setExpenses(data.expenses);
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return (
          <Setup 
            settings={settings} 
            onSettingsChange={setSettings} 
            appData={appData} 
            onDataRestore={handleDataRestore}
            onDownloadBackup={handleDownloadBackup}
            onRestoreBackup={handleRestoreBackup}
          />
        );
      case 'income':
        return <IncomeLog income={income} settings={settings} onIncomeChange={setIncome} expenses={expenses} />;
      case 'expenses':
        return <ExpenseLog expenses={expenses} income={income} settings={settings} onExpensesChange={setExpenses} />;
      case 'monthly':
        return <MonthlyOverview income={income} expenses={expenses} settings={settings} />;
      case 'annual':
        return <AnnualOverview income={income} expenses={expenses} settings={settings} />;
      case 'reports':
        return <Reports income={income} expenses={expenses} settings={settings} />;
      case 'invoices':
        return <Invoices settings={settings} />;
      case 'reconciliation':
        return <BankReconciliation income={income} expenses={expenses} settings={settings} onIncomeChange={setIncome} onExpensesChange={setExpenses} onSettingsChange={setSettings} />;
      default:
        return (
          <Setup 
            settings={settings} 
            onSettingsChange={setSettings} 
            appData={appData} 
            onDataRestore={handleDataRestore}
            onDownloadBackup={handleDownloadBackup}
            onRestoreBackup={handleRestoreBackup}
          />
        );
    }
  };

  // Auto-save on window close
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Data is already saved via useLocalStorage, but we can add additional logic here if needed
      localStorage.setItem('auditthis-last-save', new Date().toISOString());
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Show loading screen while initializing
  if (isLoading) {
    return (
      <div className="h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Loading AuditThis!</h1>
          <p className="text-gray-600 dark:text-gray-400">Initializing your workspace...</p>
        </div>
      </div>
    );
  }

  // Show first-time setup if needed
  if (isFirstTime) {
    return (
      <div className="h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 flex flex-col overflow-hidden">
        <Navigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          companies={companies}
          activeCompany={activeCompany}
          onSwitchCompany={switchCompany}
          onCreateCompany={createCompany}
          onDeleteCompany={deleteCompany}
        />
        <div className="flex-1 overflow-hidden">
          {renderActiveTab()}
        </div>
        <FirstTimeSetup
          onCreateCompany={handleCreateCompany}
          onCompleteSetup={completeFirstTimeSetup}
        />
      </div>
    );
  }

  // Don't render main app until we have an active company
  if (!activeCompany) {
    return (
      <div className="h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No Company Selected</h1>
          <p className="text-gray-600 dark:text-gray-400">Please create or select a company to continue</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reload Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 flex flex-col overflow-hidden ${isFirstTime ? 'brightness-50' : ''}`}>
      <Navigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        companies={companies}
        activeCompany={activeCompany}
        onSwitchCompany={switchCompany}
        onCreateCompany={createCompany}
        onDeleteCompany={deleteCompany}
      />
      <div className="flex-1 overflow-hidden">
        {renderActiveTab()}
      </div>
    </div>
  );
}

export default App;