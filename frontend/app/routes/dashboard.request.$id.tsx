// frontend/app/routes/dashboard.request.$id.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';

interface Item {
  id: number;
  item_name: string;
  qty: number;
  price: string;
}

interface ApprovalStep {
  id: number;
  approver: number;
  approver_name: string;
  level: number;
  status: 'APPROVED' | 'REJECTED' | 'PENDING';
  comments: string;
  created_at: string;
}

interface FinanceNote {
  id: number;
  finance_user: number;
  finance_user_name: string;
  note: string;
  created_at: string;
}

interface RequestDetail {
  id: number;
  title: string;
  description: string;
  amount: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  required_approval_levels: number;
  proforma_invoice: string | null;
  purchase_order: string | null;
  receipt: string | null;
  created_at: string;
  updated_at: string;
  created_by_name: string;
  items: Item[];
  approval_steps: ApprovalStep[];
  finance_notes: FinanceNote[];
}

export default function RequestDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const { 
    fetchRequestDetails, 
    requestDetails, 
    isLoadingRequestDetails, 
    approveRequest, 
    rejectRequest, 
    addFinanceNote,
    uploadRequestFiles 
  } = useData();

  // Approver Form State
  const [approvalAction, setApprovalAction] = useState<'APPROVED' | 'REJECTED' | null>(null);
  const [approvalComment, setApprovalComment] = useState('');
  const [isSubmittingApproval, setIsSubmittingApproval] = useState(false);

  // Finance Note Form State
  const [financeNote, setFinanceNote] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  // Finance File Upload State
  const [purchaseOrderFile, setPurchaseOrderFile] = useState<File | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);

  useEffect(() => {
    if (id) {
      fetchRequestDetails(parseInt(id));
    }
  }, [id, fetchRequestDetails]);

  const request = requestDetails as RequestDetail | null;

  const handleApprovalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!approvalAction || !id) return;

    setIsSubmittingApproval(true);
    try {
      if (approvalAction === 'APPROVED') {
        await approveRequest(parseInt(id), approvalComment);
        toast.success('Request approved successfully!');
      } else {
        await rejectRequest(parseInt(id), approvalComment);
        toast.success('Request rejected successfully!');
      }
      
      navigate('/dashboard/pending-requests');
    } catch (error) {
      console.error('Approval action failed:', error);
      toast.error('Failed to submit approval');
    } finally {
      setIsSubmittingApproval(false);
    }
  };

  const handleFinanceNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !financeNote.trim()) {
      toast.error('Please provide finance notes');
      return;
    }

    setIsSubmittingNote(true);
    try {
      await addFinanceNote(parseInt(id), {
        finance_user: user?.id ?? 0,
        note: financeNote,
      });
      // Refresh data and clear form
      await fetchRequestDetails(parseInt(id));
      setFinanceNote('');
    } catch (error) {
      console.error('Finance note submission failed:', error);
      toast.error('Failed to add finance note');
    } finally {
      setIsSubmittingNote(false);
    }
  };

  const handleFileUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    // Check if at least one file is selected
    if (!purchaseOrderFile && !receiptFile) {
      toast.error('Please select at least one file to upload');
      return;
    }

    setIsUploadingFiles(true);
    try {
      const formData = new FormData();
      
      if (purchaseOrderFile) {
        formData.append('purchase_order', purchaseOrderFile);
      }
      
      if (receiptFile) {
        formData.append('receipt', receiptFile);
      }

      await uploadRequestFiles(parseInt(id), formData as any);
      toast.success('Files uploaded successfully!');
      
      // Refresh data and clear form
      await fetchRequestDetails(parseInt(id));
      setPurchaseOrderFile(null);
      setReceiptFile(null);
      
      // Reset file inputs
      const fileInputs = document.querySelectorAll('input[type="file"]');
      fileInputs.forEach((input: any) => (input.value = ''));
    } catch (error) {
      console.error('File upload failed:', error);
      toast.error('Failed to upload files');
    } finally {
      setIsUploadingFiles(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-800 border-green-200';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'REJECTED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const calculateItemTotal = (item: Item) => {
    return (item.qty * parseFloat(item.price)).toFixed(2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoadingRequestDetails) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading request details...</p>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <p className="text-gray-600">Request not found</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-4 text-green-600 hover:text-green-700 font-medium"
        >
          ← Back to Dashboard
        </button>
      </div>
    );
  }

  const canApprove = user?.role === 'approver' && request.status === 'PENDING';
  const canViewFinanceForms = user?.role === 'finance' && request.status === 'APPROVED';

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-600 hover:text-gray-800 font-medium mb-4 flex items-center gap-2"
        >
          ← Back
        </button>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Request Details</h1>
            <p className="text-gray-600 mt-1">Request ID: REQ-{String(request.id).padStart(3, '0')}</p>
          </div>
          <span className={`px-4 py-2 rounded-lg text-sm font-medium border ${getStatusColor(request.status)}`}>
            {request.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Request Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Request Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Title</label>
                <p className="text-lg font-semibold text-gray-800 mt-1">{request.title}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Description</label>
                <p className="text-gray-700 mt-1 bg-gray-50 p-3 rounded-lg">{request.description}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Total Amount</label>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  ${parseFloat(request.amount).toLocaleString()}
                </p>
              </div>

              {/* Items Table */}
              <div>
                <label className="text-sm font-medium text-gray-600 mb-3 block">Items</label>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {request.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-3 text-sm text-gray-800">{item.item_name}</td>
                          <td className="px-4 py-3 text-sm text-gray-800">{item.qty}</td>
                          <td className="px-4 py-3 text-sm text-gray-800">${parseFloat(item.price).toFixed(2)}</td>
                          <td className="px-4 py-3 text-sm font-semibold text-gray-800">${calculateItemTotal(item)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan={3} className="px-4 py-3 text-right text-sm font-semibold text-gray-800">Grand Total:</td>
                        <td className="px-4 py-3 text-sm font-bold text-green-600">${parseFloat(request.amount).toFixed(2)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Attachments */}
              {request.proforma_invoice && (
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">Proforma Invoice</label>
                  <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                    <span className="text-xl">📄</span>
                    <span className="text-gray-700">Proforma Invoice</span>
                    <a 
                      href={request.proforma_invoice}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto text-green-600 hover:text-green-700 text-sm font-medium"
                    >
                      Download →
                    </a>
                  </div>
                </div>
              )}

              {request.purchase_order && (
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">Purchase Order</label>
                  <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                    <span className="text-xl">📋</span>
                    <span className="text-gray-700">Purchase Order</span>
                    <a 
                      href={request.purchase_order}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto text-green-600 hover:text-green-700 text-sm font-medium"
                    >
                      Download →
                    </a>
                  </div>
                </div>
              )}

              {request.receipt && (
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">Receipt</label>
                  <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                    <span className="text-xl">🧾</span>
                    <span className="text-gray-700">Receipt</span>
                    <a 
                      href={request.receipt}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto text-green-600 hover:text-green-700 text-sm font-medium"
                    >
                      Download →
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Approval Steps History */}
          {request.approval_steps && request.approval_steps.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Approval History</h2>
              
              <div className="space-y-4">
                {request.approval_steps.map((step) => (
                  <div key={step.id} className={`border-l-4 pl-4 py-2 ${
                    step.status === 'APPROVED' ? 'border-green-500' :
                    step.status === 'REJECTED' ? 'border-red-500' :
                    'border-yellow-500'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-semibold text-gray-800">Level {step.level}</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            step.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                            step.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {step.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          By {step.approver_name} • {formatDate(step.created_at)}
                        </p>
                        {step.comments && (
                          <p className="mt-2 text-sm text-gray-700 bg-gray-50 p-2 rounded">
                            💬 {step.comments}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Finance Notes */}
          {request.finance_notes && request.finance_notes.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Finance Notes</h2>
              <div className="space-y-3">
                {request.finance_notes.map((note) => (
                  <div key={note.id} className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-semibold text-gray-800">💼 {note.finance_user_name}</span>
                      <span className="text-xs text-gray-600">{formatDate(note.created_at)}</span>
                    </div>
                    <p className="text-gray-700">{note.note}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - 1 column */}
        <div className="space-y-6">
          {/* Requester Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Request Information</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Created By</label>
                <p className="text-gray-800 mt-1">{request.created_by_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Created Date</label>
                <p className="text-gray-800 mt-1">
                  {formatDate(request.created_at)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Last Updated</label>
                <p className="text-gray-800 mt-1">
                  {formatDate(request.updated_at)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Required Approvals</label>
                <p className="text-gray-800 mt-1">
                  {request.approval_steps.filter(s => s.status === 'APPROVED').length} / {request.required_approval_levels}
                </p>
              </div>
            </div>
          </div>

          {/* Approver Action Form */}
          {canApprove && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Approval Action</h3>
              <form onSubmit={handleApprovalSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Decision *
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="action"
                        value="APPROVED"
                        checked={approvalAction === 'APPROVED'}
                        onChange={() => setApprovalAction('APPROVED')}
                        className="mr-3"
                        required
                      />
                      <div>
                        <span className="text-gray-800 font-medium">✅ Approve Request</span>
                        <p className="text-xs text-gray-600">Approve and forward to next level</p>
                      </div>
                    </label>
                    <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="action"
                        value="REJECTED"
                        checked={approvalAction === 'REJECTED'}
                        onChange={() => setApprovalAction('REJECTED')}
                        className="mr-3"
                        required
                      />
                      <div>
                        <span className="text-gray-800 font-medium">❌ Reject Request</span>
                        <p className="text-xs text-gray-600">Reject with reason required</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comment {approvalAction === 'REJECTED' && <span className="text-red-600">*</span>}
                  </label>
                  <textarea
                    value={approvalComment}
                    onChange={(e) => setApprovalComment(e.target.value)}
                    rows={4}
                    required={approvalAction === 'REJECTED'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder={approvalAction === 'REJECTED' ? 'Please provide a reason for rejection...' : 'Optional approval notes...'}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingApproval || !approvalAction}
                  className={`w-full text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed ${
                    approvalAction === 'APPROVED'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {isSubmittingApproval ? 'Processing...' : `Submit ${approvalAction === 'APPROVED' ? 'Approval' : 'Rejection'}`}
                </button>
              </form>
            </div>
          )}

          {/* Finance Forms - Only for Finance Role */}
          {canViewFinanceForms && (
            <>
              {/* Finance Note Form */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">💬 Add Finance Note</h3>
                <form onSubmit={handleFinanceNoteSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Note *
                    </label>
                    <textarea
                      value={financeNote}
                      onChange={(e) => setFinanceNote(e.target.value)}
                      rows={4}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Add payment details, invoice number, transaction reference, etc..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      💡 Include payment reference, invoice numbers, and transaction details
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingNote || !financeNote.trim()}
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isSubmittingNote ? 'Submitting...' : 'Add Finance Note'}
                  </button>
                </form>
              </div>

              {/* File Upload Form */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">📎 Upload Documents</h3>
                <form onSubmit={handleFileUploadSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Purchase Order
                    </label>
                    <input
                      type="file"
                      onChange={(e) => setPurchaseOrderFile(e.target.files?.[0] || null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                    {purchaseOrderFile && (
                      <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                        ✓ {purchaseOrderFile.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Receipt
                    </label>
                    <input
                      type="file"
                      onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                    {receiptFile && (
                      <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                        ✓ {receiptFile.name}
                      </p>
                    )}
                  </div>

                  <p className="text-xs text-gray-500">
                    📌 Upload at least one document (Purchase Order or Receipt)
                  </p>

                  <button
                    type="submit"
                    disabled={isUploadingFiles || (!purchaseOrderFile && !receiptFile)}
                    className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isUploadingFiles ? 'Uploading...' : 'Upload Documents'}
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}