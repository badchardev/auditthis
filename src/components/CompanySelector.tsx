import React, { useState } from 'react';
import { Company } from '../types';
import { Building, ChevronDown, Plus, Trash2, X } from 'lucide-react';

interface CompanySelectorProps {
  companies: Company[];
  activeCompany: Company | null;
  onSwitchCompany: (companyId: string) => void;
  onCreateCompany: (name: string) => void;
  onDeleteCompany: (companyId: string) => void;
}

const CompanySelector: React.FC<CompanySelectorProps> = ({
  companies,
  activeCompany,
  onSwitchCompany,
  onCreateCompany,
  onDeleteCompany
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');

  const handleCreateCompany = () => {
    if (newCompanyName.trim()) {
      onCreateCompany(newCompanyName.trim());
      setNewCompanyName('');
      setShowCreateForm(false);
      setIsOpen(false);
    }
  };

  const handleDeleteCompany = (companyId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (companies.length <= 1) {
      alert('Cannot delete the last company. You must have at least one company.');
      return;
    }
    
    if (confirm('Are you sure you want to delete this company? All data will be permanently lost.')) {
      onDeleteCompany(companyId);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
        style={{ 
          WebkitAppRegion: 'no-drag',
          cursor: 'pointer',
          position: 'relative',
          zIndex: 1002
        } as React.CSSProperties}
      >
        <Building className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        <span className="text-sm font-medium text-gray-900 dark:text-white max-w-32 truncate">
          {activeCompany?.name || 'Select Company'}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50">
          <div className="p-4 border-b border-gray-200 dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Companies</h3>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {companies.map((company) => (
              <div
                key={company.id}
                className={`flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200 ${
                  activeCompany?.id === company.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
                onClick={() => {
                  onSwitchCompany(company.id);
                  setIsOpen(false);
                }}
              >
                <div className="flex items-center space-x-3">
                  <Building className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{company.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Created {new Date(company.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {activeCompany?.id === company.id && (
                    <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded-full">
                      Active
                    </span>
                  )}
                  {companies.length > 1 && (
                    <button
                      onClick={(e) => handleDeleteCompany(company.id, e)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                      title="Delete Company"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-600">
            {showCreateForm ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  placeholder="Company name"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateCompany()}
                  autoFocus
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleCreateCompany}
                    disabled={!newCompanyName.trim()}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => {
                      setShowCreateForm(false);
                      setNewCompanyName('');
                    }}
                    className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowCreateForm(true)}
                className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>New Company</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default CompanySelector;