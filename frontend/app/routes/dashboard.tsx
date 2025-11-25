import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { apiRequest } from '../config/api';
import { API_ENDPOINTS } from '../config/endpoints';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  useEffect(() => {
    async function fetchData() {
      try {
        // Example: Fetch some data
        const result = await apiRequest(API_ENDPOINTS.user);
        setData(result);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <ProtectedRoute>
      <div style={{ padding: '2rem' }}>
        <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back, {user?.first_name}!</p>
            <p>Role: {user?.role}</p>
          </div>
          <button 
            onClick={handleLogout}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Logout
          </button>
        </header>
        
        <main>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div>
              <h2>Your Data</h2>
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}