// frontend/app/components/DashboardLayout.tsx
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

interface NavItem {
  name: string;
  path: string;
  icon: string;
  roles?: string[];
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Navigation items based on user role
  const navItems: NavItem[] = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'My Profile', path: '/dashboard/profile', icon: '👤' },
    { 
      name: 'New Request', 
      path: '/dashboard/new-request', 
      icon: '➕',
      roles: ['staff']
    },
    { 
      name: 'My Requests', 
      path: '/dashboard/my-requests', 
      icon: '📝',
      roles: ['staff']
    },
    { 
      name: 'Pending Requests', 
      path: '/dashboard/pending-requests', 
      icon: '⏳',
      roles: ['approver', 'finance']
    },
    { 
      name: 'Approved Requests', 
      path: '/dashboard/approved-requests', 
      icon: '✅',
      roles: ['approver', 'finance']
    },
    { 
      name: 'All Requests', 
      path: '/dashboard/all-requests', 
      icon: '📋',
      roles: ['finance']
    },
    { 
      name: 'Reports', 
      path: '/dashboard/reports', 
      icon: '📈',
      roles: ['approver', 'finance']
    },
  ];

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter(item => 
    !item.roles || item.roles.includes(user?.role || '')
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside 
        className={`fixed left-0 top-0 h-full bg-gray-900 text-white transition-all duration-300 z-30 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-700">
          {sidebarOpen ? (
            <h1 className="text-xl font-bold text-green-400">PurchaseGate</h1>
          ) : (
            <span className="text-2xl">🛒</span>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-white"
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6">
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 transition-colors ${
                  isActive 
                    ? 'bg-green-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {sidebarOpen && (
                  <span className="ml-3">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Top Bar */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 sticky top-0 z-20">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              {navItems.find(item => item.path === location.pathname)?.name || 'Dashboard'}
            </h2>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center space-x-3 hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors"
            >
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium text-gray-700">{user?.username}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
              <span className="text-gray-400">▼</span>
            </button>

            {/* Dropdown Menu */}
            {userMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setUserMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-20 border border-gray-200">
                  <Link
                    to="/dashboard/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    👤 My Profile
                  </Link>
                  <Link
                    to="/dashboard/change-password"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    🔒 Change Password
                  </Link>
                  <hr className="my-2 border-gray-200" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    🚪 Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 min-h-[calc(100vh-8rem)]">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-4 px-6">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <p>&copy; 2025 PurchaseGate. All rights reserved.</p>
            <p>Version 1.0.0</p>
          </div>
        </footer>
      </div>
    </div>
  );
}