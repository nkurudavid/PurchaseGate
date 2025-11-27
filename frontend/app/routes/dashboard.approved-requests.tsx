// frontend/app/routes/dashboard.approved-requests.tsx
import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router';
import { useData } from '../contexts/DataContext';

export default function ApprovedRequests() {
  const { requests, isLoadingRequests, fetchRequests } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    fetchRequests().catch(console.error);
  }, [fetchRequests]);

  // Filter only approved requests
  const approvedRequests = useMemo(() => {
    return requests.filter(r => (r.status || '').toString().toUpperCase() === 'APPROVED');
  }, [requests]);

  const filteredRequests = useMemo(() => {
    return approvedRequests.filter(request => {
      const rAny = request as any;
      const matchesSearch = (rAny.title || '').toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (request.id || '').toString().includes(searchTerm) ||
                           (rAny.created_by_name || '').toString().toLowerCase().includes(searchTerm.toLowerCase());
      
      if (dateFilter === 'all') return matchesSearch;
      
      const requestDate = new Date((request as any).updated_at || request.created_at);
      const today = new Date();

      // Normalize both dates to the start of their day to avoid partial-day issues
      const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const startOfRequestDate = new Date(requestDate.getFullYear(), requestDate.getMonth(), requestDate.getDate());

      const msPerDay = 1000 * 60 * 60 * 24;
      const daysAgo = Math.floor((startOfToday.getTime() - startOfRequestDate.getTime()) / msPerDay);

      // Exclude future-dated requests
      if (daysAgo < 0) return false;

      if (dateFilter === 'week' && daysAgo <= 7) return matchesSearch;
      if (dateFilter === 'month' && daysAgo <= 30) return matchesSearch;
      
      return false;
    });
  }, [approvedRequests, searchTerm, dateFilter]);

  const totalAmount = useMemo(() => {
    return filteredRequests.reduce((sum, req) => {
      const rAny = req as any;
      return sum + parseFloat(rAny.amount || '0');
    }, 0);
  }, [filteredRequests]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoadingRequests) {
    return (
      <>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading approved requests...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div>
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Approved Requests</h1>
          <p className="text-gray-600 mt-1">View all approved purchase requests and their status</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-green-500">
            <p className="text-gray-600 text-sm">Total Approved</p>
            <p className="text-3xl font-bold text-gray-800">{filteredRequests.length}</p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-blue-500">
            <p className="text-gray-600 text-sm">Total Amount</p>
            <p className="text-3xl font-bold text-gray-800">${totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-purple-500">
            <p className="text-gray-600 text-sm">With Finance Notes</p>
            <p className="text-3xl font-bold text-gray-800">
              {filteredRequests.filter(r => (r as any).finance_note).length}
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
                placeholder="Search by request ID, title, or requester..."
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
          {filteredRequests.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requester</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Approvals</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Approved Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredRequests.map((request) => {
                    const rAny = request as any;
                    return (
                      <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          REQ-{String(request.id).padStart(3, '0')}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {rAny.title || ''}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">
                          ${parseFloat(rAny.amount || '0').toLocaleString(undefined, {minimumFractionDigits: 2})}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {rAny.created_by_name || ''}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-600">
                            {rAny.approval_steps?.filter((s: any) => s.status === 'APPROVED').length || 0}/{rAny.required_approval_levels || 0} approvals
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {formatDate(request.updated_at)}
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
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No approved requests found</h3>
              <p className="text-gray-600">
                {searchTerm || dateFilter !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'No approved requests yet'}
              </p>
            </div>
          )}
        </div>

        {/* Export/Download Section */}
        {filteredRequests.length > 0 && (
          <div className="mt-6 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Showing {filteredRequests.length} approved request(s)
            </p>
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2">
              <span>📥</span>
              Export to Excel
            </button>
          </div>
        )}
      </div>
    </>
  );
}