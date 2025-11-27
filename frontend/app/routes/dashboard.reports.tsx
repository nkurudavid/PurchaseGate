// frontend/app/routes/dashboard.reports.tsx
import { useState, useEffect, useMemo } from 'react';
import { useData } from '../contexts/DataContext';

export default function Reports() {
  const { requests, isLoadingRequests, fetchRequests } = useData();
  const [reportType, setReportType] = useState('summary');
  const [dateRange, setDateRange] = useState('all');

  useEffect(() => {
    fetchRequests().catch(console.error);
  }, [fetchRequests]);

  // Filter requests by date range
  const filteredRequests = useMemo(() => {
    if (dateRange === 'all') return requests;

    const now = new Date();
    const ranges: Record<string, number> = {
      week: 7,
      month: 30,
      quarter: 90,
      year: 365,
    };

    const daysAgo = ranges[dateRange] || 0;
    const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

    return requests.filter(r => new Date(r.created_at) >= cutoffDate);
  }, [requests, dateRange]);

  // Calculate key metrics
  const metrics = useMemo(() => {
    const total = filteredRequests.length;
    const approved = filteredRequests.filter(r => r.status === 'APPROVED').length;
    const rejected = filteredRequests.filter(r => r.status === 'REJECTED').length;
    const pending = filteredRequests.filter(r => r.status === 'PENDING').length;
    const totalAmount = filteredRequests.reduce((sum, r) => sum + parseFloat(r.amount || '0'), 0);
    const approvalRate = total > 0 ? ((approved / total) * 100).toFixed(1) : '0';

    return { total, approved, rejected, pending, totalAmount, approvalRate };
  }, [filteredRequests]);

  // Group by month for trends
  const monthlyData = useMemo(() => {
    const monthMap = new Map<string, { requests: number; approved: number; amount: number }>();

    filteredRequests.forEach(req => {
      const date = new Date(req.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleString('en-US', { month: 'short', year: 'numeric' });

      if (!monthMap.has(monthKey)) {
        monthMap.set(monthKey, { requests: 0, approved: 0, amount: 0 });
      }

      const data = monthMap.get(monthKey)!;
      data.requests++;
      if (req.status === 'APPROVED') data.approved++;
      data.amount += parseFloat(req.amount || '0');
    });

    return Array.from(monthMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6) // Last 6 months
      .map(([key, data]) => {
        const [year, month] = key.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1);
        return {
          month: date.toLocaleString('en-US', { month: 'short' }),
          ...data
        };
      });
  }, [filteredRequests]);

  // Top items analysis
  const topItems = useMemo(() => {
    const itemMap = new Map<string, { count: number; amount: number }>();

    filteredRequests.forEach(req => {
      req.items?.forEach(item => {
        if (!itemMap.has(item.item_name)) {
          itemMap.set(item.item_name, { count: 0, amount: 0 });
        }
        const data = itemMap.get(item.item_name)!;
        data.count += item.qty;
        data.amount += item.qty * parseFloat(item.price || '0');
      });
    });

    return Array.from(itemMap.entries())
      .map(([item, data]) => ({ item, ...data }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10);
  }, [filteredRequests]);

  // Status distribution
  const statusDistribution = useMemo(() => {
    return [
      { 
        status: 'Approved', 
        count: metrics.approved, 
        percentage: metrics.total > 0 ? ((metrics.approved / metrics.total) * 100).toFixed(1) : '0',
        color: 'bg-green-500'
      },
      { 
        status: 'Pending', 
        count: metrics.pending, 
        percentage: metrics.total > 0 ? ((metrics.pending / metrics.total) * 100).toFixed(1) : '0',
        color: 'bg-yellow-500'
      },
      { 
        status: 'Rejected', 
        count: metrics.rejected, 
        percentage: metrics.total > 0 ? ((metrics.rejected / metrics.total) * 100).toFixed(1) : '0',
        color: 'bg-red-500'
      },
    ];
  }, [metrics]);

  // Requester activity
  const topRequesters = useMemo(() => {
    const requesterMap = new Map<string, { count: number; approved: number; amount: number }>();

    filteredRequests.forEach(req => {
      if (!requesterMap.has(req.created_by_name)) {
        requesterMap.set(req.created_by_name, { count: 0, approved: 0, amount: 0 });
      }
      const data = requesterMap.get(req.created_by_name)!;
      data.count++;
      if (req.status === 'APPROVED') data.approved++;
      data.amount += parseFloat(req.amount || '0');
    });

    return Array.from(requesterMap.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [filteredRequests]);

  const handleExportCSV = () => {
    const headers = ['Month', 'Requests', 'Approved', 'Amount'];
    const csvRows = [
      headers.join(','),
      ...monthlyData.map(data => [
        data.month,
        data.requests,
        data.approved,
        data.amount.toFixed(2)
      ].join(','))
    ];
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `purchase-reports-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoadingRequests) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
        <p className="text-gray-600 mt-1">Comprehensive insights into purchase request activities</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="quarter">Last 90 Days</option>
              <option value="year">Last Year</option>
            </select>
          </div>

          <div className="md:col-span-2 flex items-end gap-2">
            <button 
              onClick={() => fetchRequests()}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              🔄 Refresh Data
            </button>
            <p className="text-sm text-gray-600 flex items-center">
              Showing {filteredRequests.length} of {requests.length} requests
            </p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-5 rounded-lg shadow-md">
          <p className="text-blue-100 text-sm mb-1">Total Requests</p>
          <p className="text-3xl font-bold">{metrics.total}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-5 rounded-lg shadow-md">
          <p className="text-green-100 text-sm mb-1">Approved</p>
          <p className="text-3xl font-bold">{metrics.approved}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-5 rounded-lg shadow-md">
          <p className="text-yellow-100 text-sm mb-1">Pending</p>
          <p className="text-3xl font-bold">{metrics.pending}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-5 rounded-lg shadow-md">
          <p className="text-purple-100 text-sm mb-1">Approval Rate</p>
          <p className="text-3xl font-bold">{metrics.approvalRate}%</p>
        </div>
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-5 rounded-lg shadow-md">
          <p className="text-indigo-100 text-sm mb-1">Total Amount</p>
          <p className="text-3xl font-bold">${(metrics.totalAmount/1000).toFixed(0)}K</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Status Distribution */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Status Distribution</h3>
          <div className="space-y-4">
            {statusDistribution.map((item) => (
              <div key={item.status}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">{item.status}</span>
                  <span className="text-sm text-gray-600">{item.count} requests ({item.percentage}%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div
                      className={`${item.color} h-3 rounded-full transition-all`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Trends</h3>
          {monthlyData.length > 0 ? (
            <div className="space-y-3">
              {monthlyData.map((data) => {
                const maxAmount = Math.max(...monthlyData.map(d => d.amount), 1);
                const barWidth = (data.amount / maxAmount) * 100;
                return (
                  <div key={data.month}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">{data.month}</span>
                      <span className="text-sm text-gray-600">${(data.amount/1000).toFixed(1)}K</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-600 h-3 rounded-full transition-all"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-gray-500">
                      <span>{data.requests} requests</span>
                      <span>{data.approved} approved</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No data available for this period</p>
          )}
        </div>
      </div>

      {/* Top Requesters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Requesters</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Requests</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Approved</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Approval Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {topRequesters.map((requester, index) => {
                const approvalRate = requester.count > 0 ? ((requester.approved / requester.count) * 100).toFixed(0) : '0';
                return (
                  <tr key={requester.name} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full text-sm font-semibold text-blue-700">
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{requester.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{requester.count}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">{requester.approved}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">
                      ${requester.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{approvalRate}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Requested Items */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Requested Items</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg. Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {topItems.length > 0 ? (
                topItems.map((item, index) => (
                  <tr key={item.item} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-green-100 rounded-full text-sm font-semibold text-green-700">
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{item.item}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.count}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">
                      ${item.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      ${(item.amount / item.count).toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No item data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Actions */}
      <div className="flex justify-end gap-4">
        <button 
          onClick={handleExportCSV}
          disabled={monthlyData.length === 0}
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors shadow-md flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <span>📊</span>
          Export to CSV
        </button>
      </div>
    </div>
  );
}