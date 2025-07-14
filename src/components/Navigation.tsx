import React from 'react';
import { useEffect, useState } from 'react';
import { Home, TrendingUp, TrendingDown, BarChart3, Calendar, FileText, Receipt, CheckSquare } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import CompanySelector from './CompanySelector';
import { Company } from '../types';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  companies: Company[];
  activeCompany: Company | null;
  onSwitchCompany: (companyId: string) => void;
  onCreateCompany: (name: string) => void;
  onDeleteCompany: (companyId: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ 
  activeTab, 
  onTabChange, 
  companies, 
  activeCompany, 
  onSwitchCompany, 
  onCreateCompany, 
  onDeleteCompany 
}) => {
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout;
    
    const handleResize = () => {
      setIsResizing(true);
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setIsResizing(false);
      }, 150);
    };

    const handleOptimizedResize = () => {
      handleResize();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('optimizedResize', handleOptimizedResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('optimizedResize', handleOptimizedResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  const navItems = [
    { id: 'home', label: 'Setup', icon: Home },
    { id: 'income', label: 'Income', icon: TrendingUp },
    { id: 'expenses', label: 'Expenses', icon: TrendingDown },
    { id: 'monthly', label: 'Monthly', icon: BarChart3 },
    { id: 'annual', label: 'Annual', icon: Calendar },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'invoices', label: 'Invoices', icon: Receipt },
    { id: 'reconciliation', label: 'Reconciliation', icon: CheckSquare },
  ];

  return (
    <nav 
      className={`bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors ${isResizing ? 'duration-75' : 'duration-200'} select-none`}
      style={{ 
        WebkitAppRegion: 'drag',
        userSelect: 'none',
        cursor: 'default',
        position: 'relative',
        zIndex: 1000,
        width: '100%',
        minHeight: '64px'
      } as React.CSSProperties}
    >
      <div 
        className="nav-container w-full px-4 flex items-center"
        style={{ 
          WebkitAppRegion: 'drag',
          height: '100%',
          minHeight: '64px'
        } as React.CSSProperties}
      >
        {/* Left spacer */}
        <div 
          className="flex-1"
          style={{ 
            WebkitAppRegion: 'drag',
            height: '100%'
          } as React.CSSProperties}
        ></div>
        
        {/* Centered navigation items */}
        <div 
          className="flex items-center"
          style={{ 
            WebkitAppRegion: 'drag',
            height: '100%'
          } as React.CSSProperties}
        >
          <div 
            className="nav-interactive flex items-center space-x-8"
            style={{ 
              WebkitAppRegion: 'no-drag',
              position: 'relative',
              zIndex: 1001,
              pointerEvents: 'auto'
            } as React.CSSProperties}
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center space-x-2 px-4 py-4 text-sm font-medium border-b-2 transition-colors ${isResizing ? 'duration-75' : 'duration-200'} hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-lg ${
                    activeTab === item.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  style={{ 
                    WebkitAppRegion: 'no-drag',
                    cursor: 'pointer',
                    position: 'relative',
                    zIndex: 1002,
                    pointerEvents: 'auto'
                  } as React.CSSProperties}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            
            {/* Theme toggle positioned after navigation items */}
            <div 
              className="nav-interactive ml-4"
              style={{ 
                WebkitAppRegion: 'no-drag',
                cursor: 'default',
                position: 'relative',
                zIndex: 1002,
                pointerEvents: 'auto'
              } as React.CSSProperties}
            >
              <ThemeToggle />
            </div>
          </div>
        </div>
        
        {/* Right side - Company selector */}
        <div 
          className="nav-interactive flex-1 flex justify-end"
          style={{ 
            WebkitAppRegion: 'no-drag',
            cursor: 'default',
            position: 'relative',
            zIndex: 1002,
            pointerEvents: 'auto'
          } as React.CSSProperties}
        >
          <CompanySelector
            companies={companies}
            activeCompany={activeCompany}
            onSwitchCompany={onSwitchCompany}
            onCreateCompany={onCreateCompany}
            onDeleteCompany={onDeleteCompany}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navigation;