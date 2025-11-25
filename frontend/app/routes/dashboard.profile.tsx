// frontend/app/routes/dashboard.profile.tsx
import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
  const { user } = useAuth();

  const capitalize = (str?: string) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center text-white text-4xl font-semibold shadow-lg">
            {user?.first_name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              {user?.first_name} {user?.last_name}
            </h2>
            <p className="text-gray-600 capitalize text-lg mt-1">{user?.role}</p>
            <div className="mt-2">
              <span className="px-4 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                ✓ Active Account
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-3 border-b border-gray-200">
          Account Information
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-gray-600 font-medium">User ID</span>
            <span className="text-gray-800 font-semibold">#{user?.id}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-gray-600 font-medium">Full Name</span>
            <span className="text-gray-800">{user?.first_name} {user?.last_name}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-gray-600 font-medium">Email Address</span>
            <span className="text-gray-800">{user?.email}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-gray-600 font-medium">Gender</span>
            <span className="text-gray-800">{capitalize(user?.gender)}</span>
          </div>
          <div className="flex justify-between items-center py-3">
            <span className="text-gray-600 font-medium">Role</span>
            <span className="text-gray-800 capitalize">{user?.role}</span>
          </div>
        </div>
      </div>

    </div>
  );
}