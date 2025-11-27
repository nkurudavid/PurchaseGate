// frontend/app/routes/dashboard._index.tsx
import { useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Link } from 'react-router';

export default function DashboardHome() {
  const { user, isLoading: authLoading } = useAuth();
  const { requests, isLoadingRequests, fetchRequests } = useData();

  useEffect(() => {
    fetchRequests().catch(console.error);
  }, [fetchRequests]);

  if (authLoading || isLoadingRequests) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const userRole = user?.role;

  // Render appropriate dashboard based on role
  if (userRole === 'staff') {
    return <StaffDashboard user={user} requests={requests} />;
  } else if (userRole === 'approver') {
    return <ApproverDashboard user={user} requests={requests} />;
  } else if (userRole === 'finance') {
    return <FinanceDashboard user={user} requests={requests} />;
  }

  return (
    <div className="text-center py-12">
      <p className="text-gray-600">Invalid user role</p>
    </div>
  );
}

// ============================================================================
// STAFF DASHBOARD
// ============================================================================
function StaffDashboard({ user, requests }: { user: any; requests: any[] }) {
  // Calculate stats from real data
  const stats = useMemo(() => {
    const total = requests.length;
    const pending = requests.filter(r => r.status === 'PENDING').length;
    const approved = requests.filter(r => r.status === 'APPROVED').length;
    const totalValue = requests.reduce((sum, r) => sum + parseFloat(r.amount || '0'), 0);

    return [
      { label: 'Total Requests', value: total.toString(), icon: '📝', color: 'bg-blue-500', trend: 'All time' },
      { label: 'Pending', value: pending.toString(), icon: '⏳', color: 'bg-yellow-500', trend: 'Awaiting approval' },
      { label: 'Approved', value: approved.toString(), icon: '✅', color: 'bg-green-500', trend: 'Processed' },
      { label: 'Total Value', value: `$${totalValue.toFixed(2)}`, icon: '💰', color: 'bg-purple-500', trend: 'All time' },
    ];
  }, [requests]);

  // Get recent requests (last 4)
  const recentRequests = useMemo(() => {
    return [...requests]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 4);
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
        {recentRequests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Request ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">REQ-{String(request.id).padStart(3, '0')}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{request.title}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-800">${parseFloat(request.amount).toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{formatDate(request.created_at)}</td>
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
        ) : (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No requests yet</h3>
            <p className="text-gray-600 mb-4">Create your first purchase request to get started</p>
            <Link
              to="/dashboard/new-request"
              className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Create Request
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

// ============================================================================
// APPROVER DASHBOARD
// ============================================================================
function ApproverDashboard({ user, requests }: { user: any; requests: any[] }) {
  const stats = useMemo(() => {
    const userId = user?.id;
    
    // Count requests where this approver has an approval step
    const myApprovedRequests = requests.filter(r => 
      r.approval_steps?.some((step: any) => 
        step.approver === userId && step.status === 'APPROVED'
      )
    );
    
    const myRejectedRequests = requests.filter(r => 
      r.approval_steps?.some((step: any) => 
        step.approver === userId && step.status === 'REJECTED'
      )
    );
    
    // Count today's approvals
    const approvedToday = myApprovedRequests.filter(r => {
      const approvalStep = r.approval_steps?.find((step: any) => 
        step.approver === userId && step.status === 'APPROVED'
      );
      if (!approvalStep) return false;
      const today = new Date().toDateString();
      return new Date(approvalStep.created_at).toDateString() === today;
    }).length;
    
    // Pending requests that need attention (status is PENDING)
    const pending = requests.filter(r => r.status === 'PENDING').length;
    
    // Total all requests
    const total = requests.length;

    return [
      { label: 'Pending Approval', value: pending.toString(), icon: '⏳', color: 'bg-yellow-500', trend: 'Needs attention' },
      { label: 'Approved Today', value: approvedToday.toString(), icon: '✅', color: 'bg-green-500', trend: 'By you' },
      { label: 'Rejected by Me', value: myRejectedRequests.length.toString(), icon: '❌', color: 'bg-red-500', trend: `${myApprovedRequests.length} approved` },
      { label: 'Total Requests', value: total.toString(), icon: '📊', color: 'bg-blue-500', trend: 'All time' },
    ];
  }, [requests, user]);

  const pendingRequests = useMemo(() => {
    return requests
      .filter(r => r.status === 'PENDING')
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 4);
  }, [requests]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
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
          <p className="text-yellow-100 text-sm">{stats[0].value} requests awaiting approval</p>
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
            <h2 className="text-xl font-semibold text-gray-800">Pending Requests</h2>
            <p className="text-sm text-gray-600 mt-1">Requests requiring your approval</p>
          </div>
          <Link to="/dashboard/pending-requests" className="text-green-600 hover:text-green-700 font-medium text-sm">
            View All →
          </Link>
        </div>
        {pendingRequests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Request ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requester</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pendingRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">REQ-{String(request.id).padStart(3, '0')}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{request.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{request.created_by_name}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-800">${parseFloat(request.amount).toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{formatDate(request.created_at)}</td>
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
        ) : (
          <div className="p-12 text-center text-gray-600">
            <div className="text-6xl mb-4">✅</div>
            <p>No pending requests at the moment</p>
          </div>
        )}
      </div>
    </>
  );
}

// ============================================================================
// FINANCE DASHBOARD
// ============================================================================
function FinanceDashboard({ user, requests }: { user: any; requests: any[] }) {
  const stats = useMemo(() => {
    const approved = requests.filter(r => r.status === 'APPROVED').length;
    const processedToday = requests.filter(r => {
      if (r.status !== 'APPROVED') return false;
      const today = new Date().toDateString();
      return new Date(r.updated_at).toDateString() === today;
    }).length;
    const totalAmount = requests
      .filter(r => r.status === 'APPROVED')
      .reduce((sum, r) => sum + parseFloat(r.amount || '0'), 0);
    const pendingAmount = requests
      .filter(r => r.status === 'PENDING')
      .reduce((sum, r) => sum + parseFloat(r.amount || '0'), 0);

    return [
      { label: 'Approved Requests', value: approved.toString(), icon: '✅', color: 'bg-green-500', trend: 'Awaiting processing' },
      { label: 'Processed Today', value: processedToday.toString(), icon: '💳', color: 'bg-blue-500', trend: 'Completed' },
      { label: 'Total Approved', value: `$${totalAmount.toFixed(0)}`, icon: '💰', color: 'bg-purple-500', trend: 'All time' },
      { label: 'Pending Amount', value: `$${pendingAmount.toFixed(0)}`, icon: '⏰', color: 'bg-yellow-500', trend: 'In review' },
    ];
  }, [requests]);

  const approvedRequests = useMemo(() => {
    return requests
      .filter(r => r.status === 'APPROVED')
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 4);
  }, [requests]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
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
          <p className="text-green-100 text-sm">{stats[0].value} approved requests</p>
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

      {/* Approved Requests */}
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
        {approvedRequests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Request ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requester</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Approved Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {approvedRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">REQ-{String(request.id).padStart(3, '0')}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{request.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{request.created_by_name}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-800">${parseFloat(request.amount).toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{formatDate(request.updated_at)}</td>
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
        ) : (
          <div className="p-12 text-center text-gray-600">
            <div className="text-6xl mb-4">💰</div>
            <p>No approved requests at the moment</p>
          </div>
        )}
      </div>
    </>
  );
}