// frontend/app/routes/dashboard.pending-requests.tsx
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface Request {
  id: string;
  item: string;
  amount: number;
  requestedBy: string;
  department: string;
  date: string;
  urgency: string;
  description: string;
}

export default function PendingRequests() {
  const { user } = useAuth();
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [comment, setComment] = useState('');

  const pendingRequests: Request[] = [
    {
      id: 'REQ-001',
      item: 'Office Supplies Pack',
      amount: 250,
      requestedBy: 'John Smith',
      department: 'Sales',
      date: '2025-11-20',
      urgency: 'normal',
      description: 'Monthly office supplies including pens, papers, folders, and desk organizers for the sales team.'
    },
    {
      id: 'REQ-003',
      item: 'HP LaserJet Printer',
      amount: 450,
      requestedBy: 'Sarah Johnson',
      department: 'Marketing',
      date: '2025-11-18',
      urgency: 'high',
      description: 'High-speed color printer needed for marketing materials and client presentations.'
    },
    {
      id: 'REQ-006',
      item: 'Conference Room Projector',
      amount: 800,
      requestedBy: 'Mike Davis',
      department: 'IT',
      date: '2025-11-17',
      urgency: 'normal',
      description: '4K projector for the main conference room to replace the old equipment.'
    },
    {
      id: 'REQ-007',
      item: 'Software Licenses (Adobe Creative Suite)',
      amount: 1500,
      requestedBy: 'Emily Brown',
      department: 'Design',
      date: '2025-11-16',
      urgency: 'urgent',
      description: 'Annual licenses for 5 designers. Current licenses expire next week.'
    },
  ];

  const handleAction = (request: Request, action: 'approve' | 'reject') => {
    setSelectedRequest(request);
    setActionType(action);
    setShowModal(true);
  };

  const handleSubmitAction = async () => {
    if (!selectedRequest || !actionType) return;

    try {
      // API call to approve/reject
      // await apiRequest(`/api/requests/${selectedRequest.id}/${actionType}/`, {
      //   method: 'POST',
      //   body: JSON.stringify({ comment }),
      // });

      console.log(`${actionType} request ${selectedRequest.id}:`, comment);
      alert(`Request ${actionType === 'approve' ? 'approved' : 'rejected'} successfully!`);
      
      setShowModal(false);
      setSelectedRequest(null);
      setComment('');
      setActionType(null);
    } catch (error) {
      console.error('Action failed:', error);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'normal': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <>
      <div>
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Pending Requests</h1>
          <p className="text-gray-600 mt-1">
            Review and {user?.role === 'approver' ? 'approve' : 'process'} pending purchase requests
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-yellow-500">
            <p className="text-gray-600 text-sm">Total Pending</p>
            <p className="text-3xl font-bold text-gray-800">{pendingRequests.length}</p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-red-500">
            <p className="text-gray-600 text-sm">Urgent</p>
            <p className="text-3xl font-bold text-red-600">
              {pendingRequests.filter(r => r.urgency === 'urgent').length}
            </p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-blue-500">
            <p className="text-gray-600 text-sm">Total Amount</p>
            <p className="text-3xl font-bold text-gray-800">
              ${pendingRequests.reduce((sum, r) => sum + r.amount, 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Requests Grid */}
        <div className="grid grid-cols-1 gap-4">
          {pendingRequests.map((request) => (
            <div key={request.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{request.item}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(request.urgency)}`}>
                      {request.urgency.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{request.description}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Request ID</p>
                      <p className="font-medium text-gray-800">{request.id}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Requested By</p>
                      <p className="font-medium text-gray-800">{request.requestedBy}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Department</p>
                      <p className="font-medium text-gray-800">{request.department}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Date</p>
                      <p className="font-medium text-gray-800">{request.date}</p>
                    </div>
                  </div>
                </div>
                <div className="ml-6 text-right">
                  <p className="text-2xl font-bold text-gray-800">${request.amount.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleAction(request, 'approve')}
                  className="flex-1 bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  ✓ Approve
                </button>
                <button
                  onClick={() => handleAction(request, 'reject')}
                  className="flex-1 bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  ✗ Reject
                </button>
                <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {actionType === 'approve' ? 'Approve' : 'Reject'} Request
            </h3>
            
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Request ID</p>
              <p className="font-semibold text-gray-800">{selectedRequest.id}</p>
              <p className="text-sm text-gray-600 mt-2">Item</p>
              <p className="font-semibold text-gray-800">{selectedRequest.item}</p>
              <p className="text-sm text-gray-600 mt-2">Amount</p>
              <p className="font-semibold text-gray-800">${selectedRequest.amount.toLocaleString()}</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comment {actionType === 'reject' && '(Required)'}
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder={`Add a comment about this ${actionType}...`}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSubmitAction}
                className={`flex-1 text-white px-6 py-2 rounded-lg font-medium transition-colors ${
                  actionType === 'approve'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                Confirm {actionType === 'approve' ? 'Approval' : 'Rejection'}
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedRequest(null);
                  setComment('');
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}