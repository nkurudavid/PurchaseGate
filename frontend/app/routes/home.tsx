import { Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>PurchaseGate</h1>
      <p>Welcome to your purchase management system</p>
      
      {user ? (
        <div>
          <p>Logged in as: {user.username}</p>
          <Link to="/dashboard">Go to Dashboard</Link>
          <br />
          <button onClick={logout} style={{ marginTop: '1rem' }}>
            Logout
          </button>
        </div>
      ) : (
        <div>
          <Link to="/login">
            <button>Login</button>
          </Link>
          {' | '}
          <Link to="/register">
            <button>Register</button>
          </Link>
        </div>
      )}
    </div>
  );
}