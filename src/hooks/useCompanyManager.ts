import { useState, useEffect } from 'react';
import { Company, AppData, CompanyData } from '../types';

const COMPANIES_KEY = 'auditthis-companies';
const ACTIVE_COMPANY_KEY = 'auditthis-active-company';
const SETUP_COMPLETED_KEY = 'auditthis-setup-completed';

export const useCompanyManager = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [activeCompany, setActiveCompany] = useState<Company | null>(null);
  const [isFirstTime, setIsFirstTime] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load companies and active company on mount
  useEffect(() => {
    const initializeCompanies = () => {
      try {
        const savedCompanies = localStorage.getItem(COMPANIES_KEY);

        if (!savedCompanies) {
          // Create demo company
          const demoCompany: Company = {
            id: 'demo-company',
            name: 'Demo Company',
            createdAt: new Date().toISOString(),
            isActive: true
          };
          
          setCompanies([demoCompany]);
          setActiveCompany(demoCompany);
          
          // Save demo company
          localStorage.setItem(COMPANIES_KEY, JSON.stringify([demoCompany]));
          localStorage.setItem(ACTIVE_COMPANY_KEY, demoCompany.id);
          setIsFirstTime(true); // Show first time setup
        } else {
          const companiesList = JSON.parse(savedCompanies);
          setCompanies(companiesList);
          
          // Simple logic: if ONLY demo company exists, show first time setup
          const hasOnlyDemoCompany = companiesList.length === 1 && companiesList[0].id === 'demo-company';
          setIsFirstTime(hasOnlyDemoCompany);
          
          // Set active company
          const savedActiveCompanyId = localStorage.getItem(ACTIVE_COMPANY_KEY);
          if (savedActiveCompanyId) {
            const active = companiesList.find((c: Company) => c.id === savedActiveCompanyId);
            if (active) {
              setActiveCompany(active);
            } else {
              // Fallback to first company
              setActiveCompany(companiesList[0]);
              localStorage.setItem(ACTIVE_COMPANY_KEY, companiesList[0].id);
            }
          } else {
            // No active company set, use first one
            setActiveCompany(companiesList[0]);
            localStorage.setItem(ACTIVE_COMPANY_KEY, companiesList[0].id);
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing companies:', error);
        
        // Emergency fallback
        const emergencyCompany: Company = {
          id: 'emergency-company',
          name: 'My Company',
          createdAt: new Date().toISOString(),
          isActive: true
        };
        
        setCompanies([emergencyCompany]);
        setActiveCompany(emergencyCompany);
        setIsFirstTime(false);
        setIsLoading(false);
        
        localStorage.clear();
        localStorage.setItem(COMPANIES_KEY, JSON.stringify([emergencyCompany]));
        localStorage.setItem(ACTIVE_COMPANY_KEY, emergencyCompany.id);
      }
    };

    initializeCompanies();
  }, []);

  const createCompany = (name: string): Company => {
    const newCompany: Company = {
      id: `company-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      createdAt: new Date().toISOString(),
      isActive: true
    };

    const updatedCompanies = [...companies, newCompany];
    setCompanies(updatedCompanies);
    setActiveCompany(newCompany);

    // Save to localStorage
    localStorage.setItem(COMPANIES_KEY, JSON.stringify(updatedCompanies));
    localStorage.setItem(ACTIVE_COMPANY_KEY, newCompany.id);

    return newCompany;
  };

  const switchCompany = (companyId: string) => {
    const company = companies.find(c => c.id === companyId);
    if (company) {
      setActiveCompany(company);
      localStorage.setItem(ACTIVE_COMPANY_KEY, companyId);
    }
  };

  const deleteCompany = (companyId: string) => {
    if (companies.length <= 1) {
      alert('Cannot delete the last company. You must have at least one company.');
      return;
    }

    const updatedCompanies = companies.filter(c => c.id !== companyId);
    setCompanies(updatedCompanies);

    // If we're deleting the active company, switch to the first available one
    if (activeCompany?.id === companyId) {
      const newActive = updatedCompanies[0];
      setActiveCompany(newActive);
      localStorage.setItem(ACTIVE_COMPANY_KEY, newActive.id);
    }

    // Remove company data from localStorage
    localStorage.removeItem(`auditthis-settings-${companyId}`);
    localStorage.removeItem(`auditthis-income-${companyId}`);
    localStorage.removeItem(`auditthis-expenses-${companyId}`);

    localStorage.setItem(COMPANIES_KEY, JSON.stringify(updatedCompanies));
    
  };

  const completeFirstTimeSetup = () => {
    setIsFirstTime(false);
  };

  const isDemoCompany = (companyId?: string) => {
    return companyId === 'demo-company';
  };

  const getCompanyStorageKey = (dataType: 'settings' | 'income' | 'expenses', companyId?: string) => {
    const id = companyId || activeCompany?.id;
    return `auditthis-${dataType}-${id}`;
  };

  const createBackupForCompany = (companyData: AppData, company: Company): string => {
    const backup: CompanyData = {
      company,
      data: {
        ...companyData,
      }
    };

    const backupWithMeta = {
      ...backup,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };

    return JSON.stringify(backupWithMeta, null, 2);
  };

  const downloadCompanyBackup = (companyData: AppData, company: Company) => {
    const backupData = createBackupForCompany(companyData, company);
    const blob = new Blob([backupData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // Format company name for filename (remove spaces and special characters)
    const safeCompanyName = company.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    const date = new Date().toISOString().split('T')[0];
    
    link.download = `${safeCompanyName}-backup-${date}.dawg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const restoreCompanyBackup = (file: File): Promise<{ company: Company; data: AppData }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const backup = JSON.parse(e.target?.result as string);
          
          // Validate backup structure
          if (backup.company && backup.data && backup.data.settings && backup.data.income && backup.data.expenses) {
            resolve({
              company: backup.company,
              data: backup.data
            });
          } else {
            reject(new Error('Invalid backup file format'));
          }
        } catch (error) {
          reject(new Error('Failed to parse backup file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read backup file'));
      reader.readAsText(file);
    });
  };

  return {
    companies,
    activeCompany,
    isFirstTime,
    isLoading,
    createCompany,
    switchCompany,
    deleteCompany,
    completeFirstTimeSetup,
    getCompanyStorageKey,
    downloadCompanyBackup,
    restoreCompanyBackup,
    isDemoCompany
  };
};