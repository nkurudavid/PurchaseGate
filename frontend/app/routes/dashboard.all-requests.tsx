// frontend/app/routes/dashboard.all-requests.tsx
import { useState } from 'react';
import { Link } from 'react-router';

export default function AllRequests() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  const allRequests = [
    { id: 'REQ-001', item: 'Office Supplies', amount: 250, requester: 'John Smith', department: 'Sales', date: '2025-11-20', status: 'Pending' },
    { id: 'REQ-002', item: 'Dell Laptop XPS 15', amount: 1200, requester: 'Alice Cooper', department: 'Engineering', date: '2025-11-19', status: 'Approved' },
    { id: 'REQ-003', item: 'HP Printer', amount: 450, requester: 'Sarah Johnson', department: 'Marketing', date: '2025-11-18', status: 'Pending' },
    { id: 'REQ-004', item: 'Office Chair', amount: 180, requester: 'Mike Davis', department: 'HR', date: '2025-11-17', status: 'Rejected' },
    { id: 'REQ-005', item: 'Standing Desk', amount: 350, requester: 'Bob Wilson', department: 'HR', date: '2025-11-15', status: 'Approved' },
    { id: 'REQ-006', item: 'Projector', amount: 800, requester: 'Carol Martinez', department: 'IT', date: '2025-11-14', status: 'Pending' },
    { id: 'REQ-007', item: 'Adobe Licenses', amount: 1500, requester: 'Emily Brown', department: 'Design', date: '2025-11-13', status: 'Approved' },
    { id: 'REQ-008', item: 'Wireless Headsets', amount: 600, requester: 'David Lee', department: 'Support', date: '2025-11-12', status: 'Approved' },
    { id: 'REQ-009', item: 'Office Chairs (10)', amount: 1800, requester: 'Emma Taylor', department: 'Operations', date: '2025-11-11', status: 'Approved' },
    { id: 'REQ-010', item: 'Monitors 27"', amount: 900, requester: 'Frank Wilson', department: 'Design', date: '2025-11-10', status: 'Rejected' },
  ];

  const departments = ['all', ...new Set(allRequests.map(r => r.department))];

  const filteredRequests = allRequests.filter(request => {
    const matchesSearch = request.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.requester.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status.toLowerCase() === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || request.department === departmentFilter;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    total: allRequests.length,
    pending: allRequests.filter(r => r.status === 'Pending').length,
    approved: allRequests.filter(r => r.status === 'Approved').length,
    rejected: allRequests.filter(r => r.status === 'Rejected').length,
    totalAmount: allRequests.reduce((sum, r) => sum + r.amount, 0),
    approvedAmount: allRequests.filter(r => r.status === 'Approved').reduce((sum, r) => sum + r.amount, 0),
  };

  return (
    <>
      <div>
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">All Purchase Requests</h1>
          <p className="text-gray-600 mt-1">Complete overview of all purchase requests across departments</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
            <p className="text-gray-600 text-xs mb-1">Total Requests</p>
            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-yellow-500">
            <p className="text-gray-600 text-xs mb-1">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
            <p className="text-gray-600 text-xs mb-1">Approved</p>
            <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-red-500">
            <p className="text-gray-600 text-xs mb-1">Rejected</p>
            <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-purple-500">
            <p className="text-gray-600 text-xs mb-1">Total Amount</p>
            <p className="text-2xl font-bold text-gray-800">${stats.totalAmount.toLocaleString()}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-600">
            <p className="text-gray-600 text-xs mb-1">Approved Amt</p>
            <p className="text-2xl font-bold text-green-600">${stats.approvedAmount.toLocaleString()}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search requests..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Department Filter */}
            <div>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>
                    {dept === 'all' ? 'All Departments' : dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex gap-2 mt-4 flex-wrap">
            <button
              onClick={() => { setStatusFilter('all'); setDepartmentFilter('all'); setSearchTerm(''); }}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear Filters
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors"
            >
              Show Pending
            </button>
            <button
              onClick={() => setStatusFilter('approved')}
              className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors"
            >
              Show Approved
            </button>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
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
                    <td className="px-6 py-4 text-sm text-gray-700">{request.item}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">
                      ${request.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {request.requester}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {request.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {request.date}
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
              <p className="text-gray-500">No requests found matching your filters</p>
            </div>
          )}
        </div>

        {/* Export Button */}
        <div className="mt-6 flex justify-end">
          <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors shadow-md flex items-center gap-2">
            <span>📥</span>
            Export to Excel
          </button>
        </div>
      </div>
    </>
  );
}