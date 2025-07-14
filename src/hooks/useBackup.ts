import { AppData, Company } from '../types';

export const useBackup = (activeCompany?: Company | null) => {
  const createBackup = (data: AppData, company?: Company): string => {
    const backup = {
      ...data,
      company: company || activeCompany,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    return JSON.stringify(backup, null, 2);
  };

  const downloadBackup = (data: AppData, company?: Company) => {
    const backupData = createBackup(data, company);
    const blob = new Blob([backupData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // Format company name for filename
    const companyName = (company || activeCompany)?.name || 'company';
    const safeCompanyName = companyName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    const date = new Date().toISOString().split('T')[0];
    
    link.download = `${safeCompanyName}-backup-${date}.dawg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const restoreFromBackup = (file: File): Promise<AppData> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const backup = JSON.parse(e.target?.result as string);
          // Validate backup structure
          if (backup.settings && backup.income && backup.expenses) {
            resolve({
              settings: backup.settings,
              income: backup.income,
              expenses: backup.expenses
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

  return { downloadBackup, restoreFromBackup };
};