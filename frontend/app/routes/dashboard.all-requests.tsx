// frontend/app/routes/dashboard.all-requests.tsx
import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router';
import { useData } from '../contexts/DataContext';

export default function AllRequests() {
  const { requests, isLoadingRequests, fetchRequests } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchRequests().catch(console.error);
  }, [fetchRequests]);

  // Filter requests
  const filteredRequests = useMemo(() => {
    return requests.filter(request => {
      const matchesSearch = 
        request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `REQ-${String(request.id).padStart(3, '0')}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.created_by_name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || request.status.toLowerCase() === statusFilter.toLowerCase();
      
      return matchesSearch && matchesStatus;
    });
  }, [requests, searchTerm, statusFilter]);

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: requests.length,
      pending: requests.filter(r => r.status === 'PENDING').length,
      approved: requests.filter(r => r.status === 'APPROVED').length,
      rejected: requests.filter(r => r.status === 'REJECTED').length,
      totalAmount: requests.reduce((sum, r) => sum + parseFloat(r.amount || '0'), 0),
      approvedAmount: requests
        .filter(r => r.status === 'APPROVED')
        .reduce((sum, r) => sum + parseFloat(r.amount || '0'), 0),
    };
  }, [requests]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleExport = () => {
    // Create CSV content
    const headers = ['Request ID', 'Title', 'Amount', 'Requester', 'Date', 'Status'];
    const csvRows = [
      headers.join(','),
      ...filteredRequests.map(req => [
        `REQ-${String(req.id).padStart(3, '0')}`,
        `"${req.title}"`,
        req.amount,
        `"${req.created_by_name}"`,
        formatDate(req.created_at),
        req.status
      ].join(','))
    ];
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `purchase-requests-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoadingRequests) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">All Purchase Requests</h1>
        <p className="text-gray-600 mt-1">Complete overview of all purchase requests</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, ID, or requester..."
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
        </div>

        {/* Quick Filters */}
        <div className="flex gap-2 mt-4 flex-wrap">
          <button
            onClick={() => { setStatusFilter('all'); setSearchTerm(''); }}
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
          <button
            onClick={() => setStatusFilter('rejected')}
            className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
          >
            Show Rejected
          </button>
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredRequests.length} of {requests.length} requests
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requester</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    REQ-{String(request.id).padStart(3, '0')}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <div className="max-w-xs truncate" title={request.title}>
                      {request.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">
                    ${parseFloat(request.amount).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {request.created_by_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {formatDate(request.created_at)}
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
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-500 text-lg">No requests found matching your filters</p>
            <button
              onClick={() => { setStatusFilter('all'); setSearchTerm(''); }}
              className="mt-4 text-green-600 hover:text-green-700 font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Export Button */}
      {filteredRequests.length > 0 && (
        <div className="mt-6 flex justify-end">
          <button 
            onClick={handleExport}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors shadow-md flex items-center gap-2"
          >
            <span>📥</span>
            Export to CSV ({filteredRequests.length} requests)
          </button>
        </div>
      )}
    </div>
  );
}