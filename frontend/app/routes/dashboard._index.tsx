// frontend/app/routes/dashboard._index.tsx
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router';

export default function DashboardHome() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </>
    );
  }

  const userRole = user?.role;

  // Render appropriate dashboard based on role
  if (userRole === 'staff') {
    return <StaffDashboard user={user} />;
  } else if (userRole === 'approver') {
    return <ApproverDashboard user={user} />;
  } else if (userRole === 'finance') {
    return <FinanceDashboard user={user} />;
  }

  return (
    <>
      <div className="text-center py-12">
        <p className="text-gray-600">Invalid user role</p>
      </div>
    </>
  );
}

// ============================================================================
// STAFF DASHBOARD
// ============================================================================
function StaffDashboard({ user }: { user: any }) {
  const stats = [
    { label: 'Total Requests', value: '15', icon: '📝', color: 'bg-blue-500', trend: '+3 this week' },
    { label: 'Pending', value: '5', icon: '⏳', color: 'bg-yellow-500', trend: 'Awaiting approval' },
    { label: 'Approved', value: '8', icon: '✅', color: 'bg-green-500', trend: '2 today' },
    { label: 'Total Value', value: '$12,450', icon: '💰', color: 'bg-purple-500', trend: 'All time' },
  ];

  const myRecentRequests = [
    { id: 'REQ-015', item: 'Wireless Mouse', amount: 45, status: 'Pending', date: '2025-11-25', urgency: 'normal' },
    { id: 'REQ-014', item: 'Office Chair', amount: 280, status: 'Approved', date: '2025-11-24', urgency: 'high' },
    { id: 'REQ-013', item: 'Monitor 27"', amount: 350, status: 'Pending', date: '2025-11-23', urgency: 'normal' },
    { id: 'REQ-012', item: 'Keyboard Mechanical', amount: 120, status: 'Rejected', date: '2025-11-22', urgency: 'low' },
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
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome back, {user?.first_name || user?.username}! 👋
        </h1>
        <p className="text-gray-600 mt-2">Track and manage your purchase requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
            </div>
            <p className="text-gray-600 text-sm">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.trend}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          to="/dashboard/new-request"
          className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          <div className="text-4xl mb-3">➕</div>
          <h3 className="text-xl font-semibold mb-2">New Request</h3>
          <p className="text-green-100 text-sm">Submit a new purchase request</p>
        </Link>

        <Link
          to="/dashboard/my-requests"
          className="bg-white border-2 border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-all"
        >
          <div className="text-4xl mb-3">📋</div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800">My Requests</h3>
          <p className="text-gray-600 text-sm">View all your requests</p>
        </Link>

        <Link
          to="/dashboard/profile"
          className="bg-white border-2 border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-all"
        >
          <div className="text-4xl mb-3">👤</div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800">My Profile</h3>
          <p className="text-gray-600 text-sm">Update your information</p>
        </Link>
      </div>

      {/* Recent Requests */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">My Recent Requests</h2>
          <Link to="/dashboard/my-requests" className="text-green-600 hover:text-green-700 font-medium text-sm">
            View All →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Request ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {myRecentRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{request.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{request.item}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-800">${request.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{request.date}</td>
                  <td className="px-6 py-4 text-sm">
                    <Link to={`/dashboard/request/${request.id}`} className="text-green-600 hover:text-green-800 font-medium">
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ============================================================================
// APPROVER DASHBOARD
// ============================================================================
function ApproverDashboard({ user }: { user: any }) {
  const stats = [
    { label: 'Pending Approval', value: '12', icon: '⏳', color: 'bg-yellow-500', trend: 'Needs attention' },
    { label: 'Approved Today', value: '8', icon: '✅', color: 'bg-green-500', trend: 'Great progress' },
    { label: 'Rejected Today', value: '2', icon: '❌', color: 'bg-red-500', trend: 'With comments' },
    { label: 'Total This Month', value: '156', icon: '📊', color: 'bg-blue-500', trend: '92% approved' },
  ];

  const pendingRequests = [
    { id: 'REQ-020', item: 'Software Licenses', requester: 'John Smith', amount: 1500, department: 'IT', urgency: 'urgent', date: '2025-11-25' },
    { id: 'REQ-019', item: 'Office Furniture', requester: 'Sarah Johnson', amount: 850, department: 'HR', urgency: 'high', date: '2025-11-25' },
    { id: 'REQ-018', item: 'Marketing Materials', requester: 'Mike Davis', amount: 320, department: 'Marketing', urgency: 'normal', date: '2025-11-24' },
    { id: 'REQ-017', item: 'Laptop Dell XPS', requester: 'Emily Brown', amount: 1200, department: 'Design', urgency: 'high', date: '2025-11-24' },
  ];

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">🔥 URGENT</span>;
      case 'high': return <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded">⚠️ HIGH</span>;
      case 'normal': return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">NORMAL</span>;
      default: return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded">LOW</span>;
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Approval Dashboard 📋
        </h1>
        <p className="text-gray-600 mt-2">Review and approve pending purchase requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
            </div>
            <p className="text-gray-600 text-sm">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.trend}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          to="/dashboard/pending-requests"
          className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          <div className="text-4xl mb-3">⏳</div>
          <h3 className="text-xl font-semibold mb-2">Pending Requests</h3>
          <p className="text-yellow-100 text-sm">12 requests awaiting approval</p>
        </Link>

        <Link
          to="/dashboard/approved-requests"
          className="bg-white border-2 border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-all"
        >
          <div className="text-4xl mb-3">✅</div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800">Approved</h3>
          <p className="text-gray-600 text-sm">View approved requests</p>
        </Link>

        <Link
          to="/dashboard/reports"
          className="bg-white border-2 border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-all"
        >
          <div className="text-4xl mb-3">📈</div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800">Reports</h3>
          <p className="text-gray-600 text-sm">View analytics & insights</p>
        </Link>
      </div>

      {/* Pending Requests Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Urgent & High Priority Requests</h2>
            <p className="text-sm text-gray-600 mt-1">Requests requiring immediate attention</p>
          </div>
          <Link to="/dashboard/pending-requests" className="text-green-600 hover:text-green-700 font-medium text-sm">
            View All →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Request ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requester</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Urgency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pendingRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{request.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{request.item}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{request.requester}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{request.department}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-800">${request.amount.toLocaleString()}</td>
                  <td className="px-6 py-4">{getUrgencyBadge(request.urgency)}</td>
                  <td className="px-6 py-4 text-sm">
                    <Link to={`/dashboard/request/${request.id}`} className="text-green-600 hover:text-green-800 font-medium">
                      Review →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ============================================================================
// FINANCE DASHBOARD
// ============================================================================
function FinanceDashboard({ user }: { user: any }) {
  const stats = [
    { label: 'Approved Requests', value: '24', icon: '✅', color: 'bg-green-500', trend: 'Awaiting processing' },
    { label: 'Processed Today', value: '15', icon: '💳', color: 'bg-blue-500', trend: '$45,230 paid' },
    { label: 'Total This Month', value: '$156K', icon: '💰', color: 'bg-purple-500', trend: '+12% vs last month' },
    { label: 'Pending Payment', value: '$28K', icon: '⏰', color: 'bg-yellow-500', trend: '9 requests' },
  ];

  const approvedRequests = [
    { id: 'REQ-016', item: 'Office Supplies Pack', requester: 'Alice Cooper', amount: 850, department: 'Operations', approvedDate: '2025-11-25', financeStatus: 'Pending' },
    { id: 'REQ-015', item: 'Software Licenses', requester: 'Bob Wilson', amount: 1500, department: 'IT', approvedDate: '2025-11-25', financeStatus: 'Pending' },
    { id: 'REQ-014', item: 'Conference Equipment', requester: 'Carol Martinez', amount: 2300, department: 'Sales', approvedDate: '2025-11-24', financeStatus: 'Processed' },
    { id: 'REQ-013', item: 'Marketing Materials', requester: 'David Lee', amount: 680, department: 'Marketing', approvedDate: '2025-11-24', financeStatus: 'Processed' },
  ];

  const getFinanceStatusBadge = (status: string) => {
    return status === 'Pending' 
      ? <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">⏳ Pending</span>
      : <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">✅ Processed</span>;
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Finance Dashboard 💰
        </h1>
        <p className="text-gray-600 mt-2">Process payments and manage financial records</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
            </div>
            <p className="text-gray-600 text-sm">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.trend}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          to="/dashboard/approved-requests"
          className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          <div className="text-4xl mb-3">💳</div>
          <h3 className="text-xl font-semibold mb-2">Process Payments</h3>
          <p className="text-green-100 text-sm">24 approved requests pending</p>
        </Link>

        <Link
          to="/dashboard/all-requests"
          className="bg-white border-2 border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-all"
        >
          <div className="text-4xl mb-3">📋</div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800">All Requests</h3>
          <p className="text-gray-600 text-sm">View complete request history</p>
        </Link>

        <Link
          to="/dashboard/reports"
          className="bg-white border-2 border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-all"
        >
          <div className="text-4xl mb-3">📊</div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800">Financial Reports</h3>
          <p className="text-gray-600 text-sm">Analytics & spending insights</p>
        </Link>
      </div>

      {/* Approved Requests Pending Processing */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Approved Requests</h2>
            <p className="text-sm text-gray-600 mt-1">Recently approved requests requiring processing</p>
          </div>
          <Link to="/dashboard/approved-requests" className="text-green-600 hover:text-green-700 font-medium text-sm">
            View All →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Request ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requester</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {approvedRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{request.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{request.item}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{request.requester}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{request.department}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-800">${request.amount.toLocaleString()}</td>
                  <td className="px-6 py-4">{getFinanceStatusBadge(request.financeStatus)}</td>
                  <td className="px-6 py-4 text-sm">
                    <Link to={`/dashboard/request/${request.id}`} className="text-green-600 hover:text-green-800 font-medium">
                      Process →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}