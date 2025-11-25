import { Link } from 'react-router';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-green-600">404</h1>
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-3xl font-semibold text-gray-800 mb-2">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            to="/"
            className="block w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            🏠 Go to Home
          </Link>
          <Link
            to="/dashboard"
            className="block w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            📊 Go to Dashboard
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>Need help? Contact support</p>
        </div>
      </div>
    </div>
  );
}