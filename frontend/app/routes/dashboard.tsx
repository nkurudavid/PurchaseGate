// frontend/app/routes/dashboard.tsx
import { Outlet } from 'react-router';
import { ProtectedRoute } from '../components/ProtectedRoute';
import DashboardLayout from '../components/DashboardLayout';

export default function DashboardWrapper() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </ProtectedRoute>
  );
}