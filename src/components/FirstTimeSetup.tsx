import React, { useState } from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';

interface FirstTimeSetupProps {
  onCreateCompany: (name: string) => void;
  onCompleteSetup: () => void;
}

const FirstTimeSetup: React.FC<FirstTimeSetupProps> = ({ onCreateCompany, onCompleteSetup }) => {
  const [companyName, setCompanyName] = useState('');
  const [step, setStep] = useState(1);

  const handleCreateCompany = () => {
    if (companyName.trim()) {
      onCreateCompany(companyName.trim());
      setStep(2);
    }
  };

  const handleFinishSetup = () => {
    onCompleteSetup();
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 w-full overflow-hidden transition-colors duration-200">
        {step === 1 ? (
          <>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
              <div className="text-center mb-4">
                <h1 className="text-3xl font-bold">Welcome to AuditThis!</h1>
                <p className="text-blue-100">Professional financial tracking for people, and small businesses.</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Let's get started</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  First, we need to create your company profile. Each company has its own separate financial data, 
                  and you can switch between multiple companies at any time.
                </p>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">What you'll get:</h3>
                  <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Separate financial tracking for each company</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Individual backup files (.dawg) per company</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Easy switching between companies</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Professional reports and invoicing</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Enter your company name"
                    className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg"
                    onKeyPress={(e) => e.key === 'Enter' && handleCreateCompany()}
                    autoFocus
                  />
                </div>

                <button
                  onClick={handleCreateCompany}
                  disabled={!companyName.trim()}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Create Company</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Success Step */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-8 text-white">
              <div className="text-center mb-4">
                <h1 className="text-3xl font-bold">Company Created!</h1>
                <p className="text-green-100">Your company "{companyName}" is ready to go</p>
              </div>
            </div>

            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">You're all set!</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  There is a Demo company that is also in the company list with demo data to help you get started. You can modify or delete 
                  this data at any time. We've also included some sample income and expense categories.
                </p>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 mb-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Next steps:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="text-left">
                      <p className="font-medium text-gray-900 dark:text-white mb-2">1. Customize your setup</p>
                      <p>There is another company called "Demo Company" in the company selection that has dummy data to help you get a visual for how things work around here. New companies start completely empty - add your income streams, expense categories, and vendors in the Setup tab</p>
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900 dark:text-white mb-2">2. Start tracking</p>
                      <p>Begin logging your income and expenses using the dedicated tabs</p>
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900 dark:text-white mb-2">3. Generate reports</p>
                      <p>Create professional reports for your accountant or tax purposes</p>
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900 dark:text-white mb-2">4. Backup your data</p>
                      <p>Regularly backup your data using the .dawg file format</p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleFinishSetup}
                className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-200 text-lg font-medium"
              >
                <span>Start Using AuditThis!</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </>
        )}
      </div>
      </div>
    </div>
  );
};

export default FirstTimeSetup;