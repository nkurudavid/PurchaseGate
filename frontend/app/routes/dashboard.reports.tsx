// frontend/app/routes/dashboard.reports.tsx
import { useState } from 'react';

export default function Reports() {
  const [reportType, setReportType] = useState('summary');
  const [dateRange, setDateRange] = useState('month');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const departmentData = [
    { name: 'Engineering', requests: 45, approved: 38, rejected: 7, amount: 52500 },
    { name: 'Marketing', requests: 32, approved: 28, rejected: 4, amount: 18900 },
    { name: 'Sales', requests: 28, approved: 25, rejected: 3, amount: 15400 },
    { name: 'HR', requests: 22, approved: 20, rejected: 2, amount: 12300 },
    { name: 'Operations', requests: 35, approved: 30, rejected: 5, amount: 24700 },
    { name: 'IT', requests: 18, approved: 16, rejected: 2, amount: 28600 },
  ];

  const monthlyData = [
    { month: 'Jan', requests: 45, approved: 38, amount: 48500 },
    { month: 'Feb', requests: 52, approved: 45, amount: 56200 },
    { month: 'Mar', requests: 48, approved: 42, amount: 52100 },
    { month: 'Apr', requests: 55, approved: 48, amount: 61300 },
    { month: 'May', requests: 60, approved: 52, amount: 68900 },
    { month: 'Jun', requests: 58, approved: 50, amount: 65400 },
  ];

  const topItems = [
    { item: 'Laptops & Computers', count: 24, amount: 38400 },
    { item: 'Office Furniture', count: 18, amount: 15200 },
    { item: 'Software Licenses', count: 15, amount: 22500 },
    { item: 'Office Supplies', count: 32, amount: 8900 },
    { item: 'Electronic Equipment', count: 12, amount: 18600 },
  ];

  const totalRequests = departmentData.reduce((sum, d) => sum + d.requests, 0);
  const totalApproved = departmentData.reduce((sum, d) => sum + d.approved, 0);
  const totalRejected = departmentData.reduce((sum, d) => sum + d.rejected, 0);
  const totalAmount = departmentData.reduce((sum, d) => sum + d.amount, 0);
  const approvalRate = ((totalApproved / totalRequests) * 100).toFixed(1);

  return (
    <>
      <div>
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive insights into purchase request activities</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="summary">Summary Report</option>
                <option value="department">Department Analysis</option>
                <option value="trends">Trend Analysis</option>
                <option value="items">Item Breakdown</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
                <option value="year">Last Year</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Departments</option>
                {departmentData.map(dept => (
                  <option key={dept.name} value={dept.name}>{dept.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button className="w-full bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">
                Generate Report
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-5 rounded-lg shadow-md">
            <p className="text-blue-100 text-sm mb-1">Total Requests</p>
            <p className="text-3xl font-bold">{totalRequests}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-5 rounded-lg shadow-md">
            <p className="text-green-100 text-sm mb-1">Approved</p>
            <p className="text-3xl font-bold">{totalApproved}</p>
          </div>
          <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-5 rounded-lg shadow-md">
            <p className="text-red-100 text-sm mb-1">Rejected</p>
            <p className="text-3xl font-bold">{totalRejected}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-5 rounded-lg shadow-md">
            <p className="text-purple-100 text-sm mb-1">Approval Rate</p>
            <p className="text-3xl font-bold">{approvalRate}%</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-5 rounded-lg shadow-md">
            <p className="text-yellow-100 text-sm mb-1">Total Amount</p>
            <p className="text-3xl font-bold">${(totalAmount/1000).toFixed(0)}K</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Department Performance */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Department Performance</h3>
            <div className="space-y-4">
              {departmentData.map((dept) => {
                const deptApprovalRate = ((dept.approved / dept.requests) * 100).toFixed(0);
                return (
                  <div key={dept.name}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">{dept.name}</span>
                      <span className="text-sm text-gray-600">{dept.requests} requests</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all"
                          style={{ width: `${deptApprovalRate}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700 w-12">{deptApprovalRate}%</span>
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-gray-500">
                      <span>Approved: {dept.approved}</span>
                      <span>Amount: ${dept.amount.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Monthly Trends */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Trends</h3>
            <div className="space-y-3">
              {monthlyData.map((data, index) => {
                const maxAmount = Math.max(...monthlyData.map(d => d.amount));
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Request Count</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg. Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {topItems.map((item, index) => (
                  <tr key={item.item} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-sm font-semibold text-gray-700">
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{item.item}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.count}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">
                      ${item.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      ${(item.amount / item.count).toFixed(0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Export Actions */}
        <div className="flex justify-end gap-4">
          <button className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2">
            <span>📄</span>
            Export PDF
          </button>
          <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors shadow-md flex items-center gap-2">
            <span>📊</span>
            Export Excel
          </button>
        </div>
      </div>
    </>
  );
}