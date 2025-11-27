// frontend/app/routes/dashboard.my-requests.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useData } from '../contexts/DataContext';

interface Item {
  id: number;
  item_name: string;
  qty: number;
  price: string;
}

interface Request {
  id: number;
  title: string;
  description: string;
  amount: string;
  status: string;
  created_at: string;
  urgency?: string;
  items: Item[];
  created_by_name: string;
}

export default function MyRequests() {
  const { fetchRequests, requests, isLoadingRequests } = useData();
  const [filter, setFilter] = useState('all');
  const typedRequests: Request[] = (requests || []) as unknown as Request[];

  // Fetch requests on mount
  useEffect(() => {
    fetchRequests().catch(console.error);
  }, [fetchRequests]);

  // Filter requests
  const filteredRequests: Request[] =
    filter === 'all'
      ? typedRequests
      : typedRequests.filter(req => (req.status || '').toLowerCase() === filter);

  const getStatusColor = (status?: string) => {
    switch ((status || '').toUpperCase()) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Purchase Requests</h1>
          <p className="text-gray-600 mt-1">View and track all your purchase requests</p>
        </div>
        <Link
          to="/dashboard/new-request"
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <span className="text-xl">+</span>
          New Request
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm">Total Requests</p>
          <p className="text-2xl font-bold text-gray-800">{typedRequests.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-yellow-500">
          <p className="text-gray-600 text-sm">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">
            {typedRequests.filter(r => (r.status || '').toUpperCase() === 'PENDING').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
          <p className="text-gray-600 text-sm">Approved</p>
          <p className="text-2xl font-bold text-green-600">
            {typedRequests.filter(r => (r.status || '').toUpperCase() === 'APPROVED').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-red-500">
          <p className="text-gray-600 text-sm">Rejected</p>
          <p className="text-2xl font-bold text-red-600">
            {typedRequests.filter(r => (r.status || '').toUpperCase() === 'REJECTED').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm mb-6 p-4">
        <div className="flex gap-2 flex-wrap">
          {['all', 'pending', 'approved', 'rejected'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === f
                  ? f === 'pending'
                    ? 'bg-yellow-600 text-white'
                    : f === 'approved'
                    ? 'bg-green-600 text-white'
                    : f === 'rejected'
                    ? 'bg-red-600 text-white'
                    : 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)} Requests
            </button>
          ))}
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {isLoadingRequests ? (
          <p className="p-6 text-gray-600">Loading requests...</p>
        ) : filteredRequests.length === 0 ? (
          <p className="p-6 text-gray-600">No requests found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Request ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.map(request => (
                  <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {request.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{request.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                      ${(Number(String(request.amount)) || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          request.status
                        )}`}
                      >
                        {(request.status || '').charAt(0).toUpperCase() +
                          (request.status || '').slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                        {request.items.map((item: Item) => (
                        <div key={item.id} className="flex gap-1">
                          <span>{item.item_name}</span> <span>({item.qty})</span>
                        </div>
                        ))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {new Date(request.created_at).toLocaleDateString()}
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
        )}
      </div>
    </div>
  );
}
