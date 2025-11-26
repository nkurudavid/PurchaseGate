// frontend/app/routes/dashboard.request.$id.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

interface Request {
  id: string;
  item_name: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  vendor: string;
  urgency: string;
  justification: string;
  status: string;
  requested_by: {
    name: string;
    email: string;
    department: string;
  };
  request_date: string;
  approved_by?: string;
  approval_date?: string;
  approval_comment?: string;
  rejected_by?: string;
  rejection_date?: string;
  rejection_reason?: string;
  finance_notes?: string;
  attachments?: string[];
}

export default function RequestDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [request, setRequest] = useState<Request | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Approver Form State
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject' | null>(null);
  const [approvalComment, setApprovalComment] = useState('');
  const [isSubmittingApproval, setIsSubmittingApproval] = useState(false);
  
  // Finance Form State
  const [financeNotes, setFinanceNotes] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmittingFinance, setIsSubmittingFinance] = useState(false);

  useEffect(() => {
    fetchRequestDetails();
  }, [id]);

  const fetchRequestDetails = async () => {
    try {
      // Replace with actual API call
      // const data = await apiRequest(`/api/requests/${id}/`);
      
      // Mock data
      const mockRequest: Request = {
        id: 'REQ-001',
        item_name: 'Dell Laptop XPS 15',
        description: 'High-performance laptop for software development. Specifications: Intel i7, 32GB RAM, 1TB SSD, 15.6" 4K display.',
        quantity: 2,
        unit_price: 1200,
        total_amount: 2400,
        vendor: 'Dell Official Store',
        urgency: 'high',
        justification: 'New developers joining the team require laptops for their work. Current inventory is depleted and these are needed urgently for onboarding next week.',
        status: 'approved',
        requested_by: {
          name: 'John Smith',
          email: 'john.smith@company.com',
          department: 'Engineering',
        },
        request_date: '2025-11-20T10:30:00Z',
        attachments: ['laptop_specs.pdf', 'vendor_quote.pdf'],
      };
      
      setRequest(mockRequest);
    } catch (error) {
      console.error('Failed to fetch request:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprovalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!approvalAction) return;

    setIsSubmittingApproval(true);
    try {
      // API call to approve/reject
      // await apiRequest(`/api/requests/${id}/${approvalAction}/`, {
      //   method: 'POST',
      //   body: JSON.stringify({ comment: approvalComment }),
      // });

      alert(`Request ${approvalAction}d successfully!`);
      navigate('/dashboard/pending-requests');
    } catch (error) {
      console.error('Approval action failed:', error);
    } finally {
      setIsSubmittingApproval(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(Array.from(e.target.files));
    }
  };

  const handleFinanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingFinance(true);

    try {
      const formData = new FormData();
      formData.append('finance_notes', financeNotes);
      uploadedFiles.forEach(file => {
        formData.append('files', file);
      });

      // API call to submit finance data
      // await apiRequest(`/api/requests/${id}/finance/`, {
      //   method: 'POST',
      //   body: formData,
      // });

      alert('Finance information submitted successfully!');
      fetchRequestDetails(); // Refresh data
      setFinanceNotes('');
      setUploadedFiles([]);
    } catch (error) {
      console.error('Finance submission failed:', error);
    } finally {
      setIsSubmittingFinance(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'normal': return 'text-blue-600 bg-blue-50';
      case 'low': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">Loading request details...</div>
        </div>
      </>
    );
  }

  if (!request) {
    return (
      <>
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <p className="text-gray-600">Request not found</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 text-green-600 hover:text-green-700 font-medium"
          >
            ← Back to Dashboard
          </button>
        </div>
      </>
    );
  }

  const canApprove = user?.role === 'approver' && request.status === 'pending';
  const canViewFinanceForm = user?.role === 'finance' && request.status === 'approved';

  return (
    <>
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
              <p className="text-gray-600 mt-1">Request ID: {request.id}</p>
            </div>
            <span className={`px-4 py-2 rounded-lg text-sm font-medium border ${getStatusColor(request.status)}`}>
              {request.status.toUpperCase()}
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
                  <label className="text-sm font-medium text-gray-600">Item Name</label>
                  <p className="text-lg font-semibold text-gray-800 mt-1">{request.item_name}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Description</label>
                  <p className="text-gray-700 mt-1">{request.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Quantity</label>
                    <p className="text-gray-800 font-semibold mt-1">{request.quantity}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Unit Price</label>
                    <p className="text-gray-800 font-semibold mt-1">${request.unit_price.toLocaleString()}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Total Amount</label>
                  <p className="text-2xl font-bold text-green-600 mt-1">
                    ${request.total_amount.toLocaleString()}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Preferred Vendor</label>
                  <p className="text-gray-800 mt-1">{request.vendor || 'Not specified'}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Urgency Level</label>
                  <div className="mt-1">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getUrgencyColor(request.urgency)}`}>
                      {request.urgency.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Justification</label>
                  <p className="text-gray-700 mt-1 bg-gray-50 p-3 rounded-lg">{request.justification}</p>
                </div>

                {request.attachments && request.attachments.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-2 block">Attachments</label>
                    <div className="space-y-2">
                      {request.attachments.map((file, index) => (
                        <div key={index} className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                          <span className="text-xl">📎</span>
                          <span className="text-gray-700">{file}</span>
                          <button className="ml-auto text-green-600 hover:text-green-700 text-sm font-medium">
                            Download
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Approval/Rejection Information */}
            {(request.status === 'approved' || request.status === 'rejected') && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  {request.status === 'approved' ? 'Approval Information' : 'Rejection Information'}
                </h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">
                      {request.status === 'approved' ? 'Approved By:' : 'Rejected By:'}
                    </span>
                    <span className="font-medium text-gray-800">
                      {request.status === 'approved' ? request.approved_by : request.rejected_by}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium text-gray-800">
                      {request.status === 'approved' ? request.approval_date : request.rejection_date}
                    </span>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-2 block">
                      {request.status === 'approved' ? 'Approval Comment:' : 'Rejection Reason:'}
                    </label>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {request.status === 'approved' ? request.approval_comment : request.rejection_reason}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Finance Notes (if available) */}
            {request.status === 'approved' && request.finance_notes && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Finance Notes</h2>
                <p className="text-gray-700 bg-blue-50 p-3 rounded-lg">{request.finance_notes}</p>
              </div>
            )}
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Requester Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Requester Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Name</label>
                  <p className="text-gray-800 mt-1">{request.requested_by.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-gray-800 mt-1">{request.requested_by.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Department</label>
                  <p className="text-gray-800 mt-1">{request.requested_by.department}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Request Date</label>
                  <p className="text-gray-800 mt-1">
                    {new Date(request.request_date).toLocaleDateString()}
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
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="action"
                          value="approve"
                          checked={approvalAction === 'approve'}
                          onChange={() => setApprovalAction('approve')}
                          className="mr-2"
                          required
                        />
                        <span className="text-gray-700">Approve Request</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="action"
                          value="reject"
                          checked={approvalAction === 'reject'}
                          onChange={() => setApprovalAction('reject')}
                          className="mr-2"
                          required
                        />
                        <span className="text-gray-700">Reject Request</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Comment {approvalAction === 'reject' && '*'}
                    </label>
                    <textarea
                      value={approvalComment}
                      onChange={(e) => setApprovalComment(e.target.value)}
                      rows={4}
                      required={approvalAction === 'reject'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder={approvalAction === 'reject' ? 'Please provide a reason for rejection...' : 'Optional approval notes...'}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingApproval || !approvalAction}
                    className={`w-full text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed ${
                      approvalAction === 'approve'
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {isSubmittingApproval ? 'Processing...' : `Submit ${approvalAction === 'approve' ? 'Approval' : 'Rejection'}`}
                  </button>
                </form>
              </div>
            )}

            {/* Finance Forms */}
            {canViewFinanceForm && (
              <div className="space-y-6">
                {/* File Upload Form */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Upload Documents</h3>
                  <form onSubmit={handleFinanceSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Attach Files (Invoice, Receipt, etc.)
                      </label>
                      <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                      />
                      {uploadedFiles.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {uploadedFiles.map((file, index) => (
                            <div key={index} className="text-sm text-gray-600 flex items-center gap-2">
                              <span>📎</span>
                              <span>{file.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Finance Notes
                      </label>
                      <textarea
                        value={financeNotes}
                        onChange={(e) => setFinanceNotes(e.target.value)}
                        rows={4}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Add payment details, invoice number, transaction reference, etc..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingFinance}
                      className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {isSubmittingFinance ? 'Submitting...' : 'Submit Finance Information'}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}