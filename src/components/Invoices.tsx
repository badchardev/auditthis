import React, { useState } from 'react';
import { Invoice, InvoiceItem, AppSettings } from '../types';
import { formatCurrency } from '../utils/calculations';
import { Plus, Trash2, Download, FileText, User, Building } from 'lucide-react';
import jsPDF from 'jspdf';

interface InvoicesProps {
  settings: AppSettings;
}

const Invoices: React.FC<InvoicesProps> = ({ settings }) => {
  const createEmptyInvoice = (): Invoice => ({
    id: '',
    invoiceNumber: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    businessName: '',
    businessAddress: '',
    businessEmail: '',
    businessPhone: '',
    items: [
      {
        id: '1',
        description: '',
        quantity: 1,
        rate: 0,
        amount: 0,
      }
    ],
    subtotal: 0,
    taxRate: 0,
    taxAmount: 0,
    total: 0,
    notes: '',
  });

  const [currentInvoice, setCurrentInvoice] = useState<Invoice>(createEmptyInvoice());
  const [isGenerating, setIsGenerating] = useState(false);

  const calculateInvoiceTotals = (invoice: Invoice) => {
    const subtotal = invoice.items.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = (subtotal * invoice.taxRate) / 100;
    const total = subtotal + taxAmount;
    
    return {
      ...invoice,
      subtotal,
      taxAmount,
      total,
    };
  };

  const updateInvoiceItem = (itemId: string, field: keyof InvoiceItem, value: any) => {
    const updatedItems = currentInvoice.items.map(item => {
      if (item.id === itemId) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          updatedItem.amount = updatedItem.quantity * updatedItem.rate;
        }
        return updatedItem;
      }
      return item;
    });

    const updatedInvoice = calculateInvoiceTotals({
      ...currentInvoice,
      items: updatedItems,
    });

    setCurrentInvoice(updatedInvoice);
  };

  const addInvoiceItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0,
    };

    setCurrentInvoice(prevInvoice => calculateInvoiceTotals({
      ...prevInvoice,
      items: [...prevInvoice.items, newItem],
    }));
  };

  const removeInvoiceItem = (itemId: string) => {
    setCurrentInvoice(prevInvoice => {
      if (prevInvoice.items.length <= 1) {
        return prevInvoice; // Don't remove if it's the last item
      }
      
      const updatedItems = prevInvoice.items.filter(item => item.id !== itemId);
      const updatedInvoice = calculateInvoiceTotals({
        ...prevInvoice,
        items: updatedItems,
      });
      return updatedInvoice;
    });
  };

  const updateInvoiceField = (field: keyof Invoice, value: any) => {
    setCurrentInvoice(prevInvoice => {
      const updatedInvoice = { ...prevInvoice, [field]: value };
      if (field === 'taxRate') {
        return calculateInvoiceTotals(updatedInvoice);
      }
      return updatedInvoice;
    });
  };

  const generateInvoicePDF = async () => {
    setIsGenerating(true);
    
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Header
      pdf.setFontSize(28);
      pdf.setFont('helvetica', 'bold');
      pdf.text('INVOICE', pageWidth - 20, 30, { align: 'right' });
      
      // Invoice number and date
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Invoice #: ${currentInvoice.invoiceNumber}`, pageWidth - 20, 45, { align: 'right' });
      pdf.text(`Date: ${new Date(currentInvoice.date).toLocaleDateString()}`, pageWidth - 20, 55, { align: 'right' });
      pdf.text(`Due Date: ${new Date(currentInvoice.dueDate).toLocaleDateString()}`, pageWidth - 20, 65, { align: 'right' });
      
      // Business info
      let yPos = 30;
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('From:', 20, yPos);
      
      yPos += 10;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      if (currentInvoice.businessName) {
        pdf.text(currentInvoice.businessName, 20, yPos);
        yPos += 6;
      }
      if (currentInvoice.businessAddress) {
        const addressLines = currentInvoice.businessAddress.split('\n');
        addressLines.forEach(line => {
          pdf.text(line, 20, yPos);
          yPos += 6;
        });
      }
      if (currentInvoice.businessEmail) {
        pdf.text(currentInvoice.businessEmail, 20, yPos);
        yPos += 6;
      }
      if (currentInvoice.businessPhone) {
        pdf.text(currentInvoice.businessPhone, 20, yPos);
        yPos += 6;
      }
      
      // Client info
      yPos = 90;
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Bill To:', 20, yPos);
      
      yPos += 10;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      if (currentInvoice.clientName) {
        pdf.text(currentInvoice.clientName, 20, yPos);
        yPos += 6;
      }
      if (currentInvoice.clientAddress) {
        const addressLines = currentInvoice.clientAddress.split('\n');
        addressLines.forEach(line => {
          pdf.text(line, 20, yPos);
          yPos += 6;
        });
      }
      if (currentInvoice.clientEmail) {
        pdf.text(currentInvoice.clientEmail, 20, yPos);
        yPos += 6;
      }
      
      // Items table
      yPos = 140;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      
      // Table headers
      pdf.text('Description', 20, yPos);
      pdf.text('Qty', 120, yPos, { align: 'center' });
      pdf.text('Rate', 140, yPos, { align: 'center' });
      pdf.text('Amount', pageWidth - 20, yPos, { align: 'right' });
      
      yPos += 5;
      pdf.line(20, yPos, pageWidth - 20, yPos); // Header line
      yPos += 10;
      
      pdf.setFont('helvetica', 'normal');
      
      // Items
      currentInvoice.items.forEach((item) => {
        if (yPos > pageHeight - 60) {
          pdf.addPage();
          yPos = 20;
        }
        
        pdf.text(item.description, 20, yPos);
        pdf.text(item.quantity.toString(), 120, yPos, { align: 'center' });
        pdf.text(formatCurrency(item.rate, settings.currency), 140, yPos, { align: 'center' });
        pdf.text(formatCurrency(item.amount, settings.currency), pageWidth - 20, yPos, { align: 'right' });
        yPos += 8;
      });
      
      // Totals
      yPos += 10;
      pdf.line(120, yPos, pageWidth - 20, yPos); // Totals line
      yPos += 10;
      
      pdf.text('Subtotal:', 140, yPos);
      pdf.text(formatCurrency(currentInvoice.subtotal, settings.currency), pageWidth - 20, yPos, { align: 'right' });
      yPos += 8;
      
      if (currentInvoice.taxRate > 0) {
        pdf.text(`Tax (${currentInvoice.taxRate}%):`, 140, yPos);
        pdf.text(formatCurrency(currentInvoice.taxAmount, settings.currency), pageWidth - 20, yPos, { align: 'right' });
        yPos += 8;
      }
      
      pdf.setFont('helvetica', 'bold');
      pdf.text('Total:', 140, yPos);
      pdf.text(formatCurrency(currentInvoice.total, settings.currency), pageWidth - 20, yPos, { align: 'right' });
      
      // Notes
      if (currentInvoice.notes) {
        yPos += 20;
        pdf.setFont('helvetica', 'bold');
        pdf.text('Notes:', 20, yPos);
        yPos += 8;
        pdf.setFont('helvetica', 'normal');
        const noteLines = currentInvoice.notes.split('\n');
        noteLines.forEach(line => {
          pdf.text(line, 20, yPos);
          yPos += 6;
        });
      }
      
      const fileName = `Invoice-${currentInvoice.invoiceNumber || 'Draft'}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF invoice');
    }
    
    setIsGenerating(false);
  };

  const newInvoice = () => {
    const emptyInvoice = createEmptyInvoice();
    setCurrentInvoice(emptyInvoice);
  };

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900 transition-colors duration-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-8 h-full scrollable-content">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Invoices</h1>
            <p className="text-gray-600 dark:text-gray-400">Create and manage professional invoices</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={newInvoice}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>New Invoice</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Invoice Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Invoice Header */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Invoice Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Invoice Number</label>
                  <input
                    type="text"
                    value={currentInvoice.invoiceNumber}
                    onChange={(e) => updateInvoiceField('invoiceNumber', e.target.value)}
                    className="w-full h-12 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                    placeholder="INV-001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date</label>
                  <input
                    type="date"
                    value={currentInvoice.date}
                    onChange={(e) => updateInvoiceField('date', e.target.value)}
                    className="w-full h-12 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Due Date</label>
                  <input
                    type="date"
                    value={currentInvoice.dueDate}
                    onChange={(e) => updateInvoiceField('dueDate', e.target.value)}
                    className="w-full h-12 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Business Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Building className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Business Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Business Name</label>
                  <input
                    type="text"
                    value={currentInvoice.businessName}
                    onChange={(e) => updateInvoiceField('businessName', e.target.value)}
                    className="w-full h-12 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                    placeholder="Your Business Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={currentInvoice.businessEmail}
                    onChange={(e) => updateInvoiceField('businessEmail', e.target.value)}
                    className="w-full h-12 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                    placeholder="business@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={currentInvoice.businessPhone}
                    onChange={(e) => updateInvoiceField('businessPhone', e.target.value)}
                    className="w-full h-12 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Address</label>
                  <textarea
                    value={currentInvoice.businessAddress}
                    onChange={(e) => updateInvoiceField('businessAddress', e.target.value)}
                    className="w-full h-24 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200 resize-none"
                    rows={3}
                    placeholder="123 Business St&#10;City, State 12345"
                  />
                </div>
              </div>
            </div>

            {/* Client Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <User className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Client Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Client Name</label>
                  <input
                    type="text"
                    value={currentInvoice.clientName}
                    onChange={(e) => updateInvoiceField('clientName', e.target.value)}
                    className="w-full h-12 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                    placeholder="Client Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Client Email</label>
                  <input
                    type="email"
                    value={currentInvoice.clientEmail}
                    onChange={(e) => updateInvoiceField('clientEmail', e.target.value)}
                    className="w-full h-12 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                    placeholder="client@example.com"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Client Address</label>
                  <textarea
                    value={currentInvoice.clientAddress}
                    onChange={(e) => updateInvoiceField('clientAddress', e.target.value)}
                    className="w-full h-24 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200 resize-none"
                    rows={3}
                    placeholder="123 Client St&#10;City, State 12345"
                  />
                </div>
              </div>
            </div>

            {/* Invoice Items */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-200">
              <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600 transition-colors duration-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Invoice Items</h3>
                  <button
                    onClick={addInvoiceItem}
                    className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Item</span>
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700 transition-colors duration-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Description</th>
                      <th className="px-6 py-3 text-center text-sm font-medium text-gray-500 dark:text-gray-400">Qty</th>
                      <th className="px-6 py-3 text-center text-sm font-medium text-gray-500 dark:text-gray-400">Rate</th>
                      <th className="px-6 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Amount</th>
                      <th className="px-6 py-3 text-center text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    {currentInvoice.items.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => updateInvoiceItem(item.id, 'description', e.target.value)}
                            className="w-full h-10 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                            placeholder="Service description"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateInvoiceItem(item.id, 'quantity', Number(e.target.value))}
                            className="w-20 h-10 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200 mx-auto"
                            min="1"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center space-x-1">
                            <span className="text-gray-500 dark:text-gray-400 text-sm">{settings.currency}</span>
                            <input
                              type="number"
                              value={item.rate}
                              onChange={(e) => updateInvoiceItem(item.id, 'rate', Number(e.target.value))}
                              className="w-24 h-10 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                              step="0.01"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatCurrency(item.amount, settings.currency)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => removeInvoiceItem(item.id)}
                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                            disabled={currentInvoice.items.length === 1}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notes</h3>
              <textarea
                value={currentInvoice.notes}
                onChange={(e) => updateInvoiceField('notes', e.target.value)}
                className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200 resize-none"
                rows={4}
                placeholder="Payment terms, additional notes, etc."
              />
            </div>
          </div>

          {/* Invoice Summary */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Invoice Summary</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(currentInvoice.subtotal, settings.currency)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600 dark:text-gray-400">Tax</span>
                    <input
                      type="number"
                      value={currentInvoice.taxRate}
                      onChange={(e) => updateInvoiceField('taxRate', Number(e.target.value))}
                      className="w-16 h-8 p-1 border border-gray-300 dark:border-gray-600 rounded text-sm text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                      step="0.1"
                      min="0"
                      max="100"
                    />
                    <span className="text-gray-600 dark:text-gray-400">%</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(currentInvoice.taxAmount, settings.currency)}
                  </span>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">Total</span>
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(currentInvoice.total, settings.currency)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  onClick={generateInvoicePDF}
                  disabled={isGenerating || !currentInvoice.clientName}
                   className="w-full h-12 flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-4 h-4" />
                  <span>{isGenerating ? 'Generating...' : 'Download PDF'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoices;