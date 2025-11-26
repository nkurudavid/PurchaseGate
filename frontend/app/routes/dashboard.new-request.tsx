// frontend/app/routes/dashboard.new-request.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';

interface Item {
  item_name: string;
  qty: number;
  price: number;
}

export default function NewRequest() {
  const navigate = useNavigate();
  const { createRequest } = useData();
  const toast = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  
  const [items, setItems] = useState<Item[]>([
    { item_name: '', qty: 1, price: 0 }
  ]);
  
  const [proformaInvoice, setProformaInvoice] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateItemTotal = (item: Item) => {
    return (item.qty * item.price).toFixed(2);
  };

  const calculateGrandTotal = () => {
    return items.reduce((sum, item) => sum + (item.qty * item.price), 0).toFixed(2);
  };

  const addItem = () => {
    setItems([...items, { item_name: '', qty: 1, price: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof Item, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      
      setProformaInvoice(file);
      toast.success('File uploaded successfully');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate items
    const hasEmptyItems = items.some(item => !item.item_name || item.qty <= 0 || item.price <= 0);
    if (hasEmptyItems) {
      toast.error('Please fill in all item fields with valid values');
      setIsSubmitting(false);
      return;
    }

    try {
      // Prepare the request data
      const requestData = {
        title: formData.title,
        description: formData.description,
        amount: parseFloat(calculateGrandTotal()),
        items: items,
        // If your API expects FormData with file upload, you'll need to handle it differently
        // For now, assuming JSON request
      };

      console.log('Sending request data:', requestData); // Debug log
      await createRequest(requestData as any);
      toast.success('Purchase request submitted successfully!');
      navigate('/dashboard/my-requests');
    } catch (error) {
      console.error('Failed to submit request:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">New Purchase Request</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Request Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Request Title *
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., Purchase of Office Laptops"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Explain the purpose of this purchase request..."
            />
          </div>

          {/* Items Section */}
          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Items</h3>
              <button
                type="button"
                onClick={addItem}
                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <span className="text-xl">+</span>
                Add Item
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg relative">
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="absolute top-2 right-2 text-red-600 hover:text-red-800 font-medium text-sm"
                    >
                      ✕ Remove
                    </button>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Item Name */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Item Name *
                      </label>
                      <input
                        type="text"
                        value={item.item_name}
                        onChange={(e) => updateItem(index, 'item_name', e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="e.g., Dell Latitude 5420"
                      />
                    </div>

                    {/* Quantity */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity *
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={item.qty}
                        onChange={(e) => updateItem(index, 'qty', parseInt(e.target.value) || 0)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    {/* Unit Price */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Unit Price ($) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.price}
                        onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Item Total */}
                  <div className="mt-3 text-right">
                    <span className="text-sm text-gray-600">Item Total: </span>
                    <span className="text-lg font-semibold text-gray-800">
                      ${calculateItemTotal(item)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Grand Total */}
            <div className="mt-6 bg-green-50 border-2 border-green-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-800">Grand Total:</span>
                <span className="text-3xl font-bold text-green-600">
                  ${calculateGrandTotal()}
                </span>
              </div>
            </div>
          </div>

          {/* Proforma Invoice Upload */}
          <div>
            <label htmlFor="proformaInvoice" className="block text-sm font-medium text-gray-700 mb-2">
              Proforma Invoice (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
              <input
                id="proformaInvoice"
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                className="hidden"
              />
              <label
                htmlFor="proformaInvoice"
                className="cursor-pointer"
              >
                {proformaInvoice ? (
                  <div className="text-green-600">
                    <span className="text-2xl">📄</span>
                    <p className="mt-2 font-medium">{proformaInvoice.name}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Click to change file
                    </p>
                  </div>
                ) : (
                  <div className="text-gray-600">
                    <span className="text-4xl">📎</span>
                    <p className="mt-2 font-medium">Click to upload proforma invoice</p>
                    <p className="text-sm text-gray-500 mt-1">
                      PDF, DOC, DOCX, JPG, PNG (Max 10MB)
                    </p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}