// frontend/app/routes/dashboard._index.tsx
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/DashboardLayout';

export default function DashboardHome() {
  const { user } = useAuth();

  const stats = [
    { 
      label: user?.role === 'staff' ? 'My Requests' : 'Pending Requests', 
      value: '12', 
      icon: '📝',
      color: 'bg-blue-500'
    },
    { 
      label: user?.role === 'staff' ? 'Approved' : 'Approved Today', 
      value: '8', 
      icon: '✅',
      color: 'bg-green-500'
    },
    { 
      label: user?.role === 'staff' ? 'Pending' : 'Rejected', 
      value: '4', 
      icon: '⏳',
      color: 'bg-yellow-500'
    },
    { 
      label: 'Total Amount', 
      value: '$45,230', 
      icon: '💰',
      color: 'bg-purple-500'
    },
  ];

  const recentRequests = [
    { id: 'REQ-001', item: 'Office Supplies', amount: '$250', status: 'Pending', date: '2025-11-20' },
    { id: 'REQ-002', item: 'Laptop Dell XPS', amount: '$1,200', status: 'Approved', date: '2025-11-19' },
    { id: 'REQ-003', item: 'Printer HP LaserJet', amount: '$450', status: 'Pending', date: '2025-11-18' },
    { id: 'REQ-004', item: 'Office Chair', amount: '$180', status: 'Rejected', date: '2025-11-17' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome back, {user?.first_name}! 👋
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening with your purchase requests today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <div className={`w-14 h-14 ${stat.color} rounded-full flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Requests */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Recent Requests</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
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
              {recentRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {request.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {request.item}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {request.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {request.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-green-600 hover:text-green-800 font-medium">
                      View Details →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}