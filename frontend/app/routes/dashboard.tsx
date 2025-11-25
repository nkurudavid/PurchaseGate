// frontend/app/routes/dashboard.tsx
import { Outlet } from 'react-router';
import { ProtectedRoute } from '../components/ProtectedRoute';

export default function DashboardWrapper() {
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  );
}