// frontend/app/routes/dashboard.approved-requests.tsx
import { useState } from 'react';
import { Link } from 'react-router';

export default function ApprovedRequests() {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  const approvedRequests = [
    {
      id: 'REQ-002',
      item: 'Dell Laptop XPS 15',
      amount: 1200,
      requestedBy: 'Alice Cooper',
      department: 'Engineering',
      requestDate: '2025-11-19',
      approvedDate: '2025-11-20',
      approvedBy: 'Jane Smith',
      status: 'Approved - Pending Payment',
    },
    {
      id: 'REQ-005',
      item: 'Standing Desk',
      amount: 350,
      requestedBy: 'Bob Wilson',
      department: 'HR',
      requestDate: '2025-11-15',
      approvedDate: '2025-11-16',
      approvedBy: 'John Doe',
      status: 'Approved - Ordered',
    },
    {
      id: 'REQ-008',
      item: 'Wireless Headsets (5 units)',
      amount: 600,
      requestedBy: 'Carol Martinez',
      department: 'Customer Support',
      requestDate: '2025-11-14',
      approvedDate: '2025-11-15',
      approvedBy: 'Jane Smith',
      status: 'Approved - Delivered',
    },
    {
      id: 'REQ-009',
      item: 'Office Chairs (10 units)',
      amount: 1800,
      requestedBy: 'David Lee',
      department: 'Operations',
      requestDate: '2025-11-13',
      approvedDate: '2025-11-14',
      approvedBy: 'John Doe',
      status: 'Approved - In Transit',
    },
    {
      id: 'REQ-010',
      item: 'External Monitors (27")',
      amount: 900,
      requestedBy: 'Emma Taylor',
      department: 'Design',
      requestDate: '2025-11-12',
      approvedDate: '2025-11-13',
      approvedBy: 'Jane Smith',
      status: 'Approved - Delivered',
    },
  ];

  const filteredRequests = approvedRequests.filter(request => {
    const matchesSearch = request.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.requestedBy.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (dateFilter === 'all') return matchesSearch;
    
    const requestDate = new Date(request.approvedDate);
    const today = new Date();
    const daysAgo = Math.floor((today.getTime() - requestDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (dateFilter === 'week' && daysAgo <= 7) return matchesSearch;
    if (dateFilter === 'month' && daysAgo <= 30) return matchesSearch;
    
    return false;
  });

  const getStatusColor = (status: string) => {
    if (status.includes('Delivered')) return 'bg-green-100 text-green-800';
    if (status.includes('Transit')) return 'bg-blue-100 text-blue-800';
    if (status.includes('Ordered')) return 'bg-purple-100 text-purple-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const totalAmount = filteredRequests.reduce((sum, req) => sum + req.amount, 0);

  return (
    <>
      <div>
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Approved Requests</h1>
          <p className="text-gray-600 mt-1">View all approved purchase requests and their delivery status</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-green-500">
            <p className="text-gray-600 text-sm">Total Approved</p>
            <p className="text-3xl font-bold text-gray-800">{filteredRequests.length}</p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-blue-500">
            <p className="text-gray-600 text-sm">Total Amount</p>
            <p className="text-3xl font-bold text-gray-800">${totalAmount.toLocaleString()}</p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-purple-500">
            <p className="text-gray-600 text-sm">Ordered</p>
            <p className="text-3xl font-bold text-gray-800">
              {filteredRequests.filter(r => r.status.includes('Ordered')).length}
            </p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-green-600">
            <p className="text-gray-600 text-sm">Delivered</p>
            <p className="text-3xl font-bold text-gray-800">
              {filteredRequests.filter(r => r.status.includes('Delivered')).length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by request ID, item, or requester..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Date Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setDateFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  dateFilter === 'all'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Time
              </button>
              <button
                onClick={() => setDateFilter('week')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  dateFilter === 'week'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Last Week
              </button>
              <button
                onClick={() => setDateFilter('month')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  dateFilter === 'month'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Last Month
              </button>
            </div>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requester</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Approved Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {request.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {request.item}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">
                      ${request.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {request.requestedBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {request.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {request.approvedDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link 
                        to={`/dashboard/request/${request.id}`}
                        className="text-green-600 hover:text-green-800 font-medium"
                      >
                        View Details →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredRequests.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No approved requests found</p>
            </div>
          )}
        </div>

        {/* Export/Download Section */}
        <div className="mt-6 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Showing {filteredRequests.length} approved request(s)
          </p>
          <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2">
            <span>📥</span>
            Export to Excel
          </button>
        </div>
      </div>
    </>
  );
}