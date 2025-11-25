// frontend/app/routes/home.tsx
import { Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  if (isAuthenticated && user) {
    // Redirect authenticated users to dashboard
    window.location.href = '/dashboard';
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🛒</span>
              </div>
              <span className="ml-3 text-xl font-bold text-gray-800">PurchaseGate</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-green-600 font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/login"
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors shadow-md"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Streamline Your Purchase
            <span className="text-green-600"> Request Process</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            PurchaseGate makes it easy to submit, approve, and track purchase requests across your organization. 
            Save time, reduce errors, and gain complete visibility into your procurement workflow.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/login"
              className="bg-green-600 text-white px-8 py-4 rounded-lg font-medium text-lg hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Get Started Now →
            </Link>
            <a
              href="#features"
              className="bg-white text-gray-700 px-8 py-4 rounded-lg font-medium text-lg hover:bg-gray-50 transition-colors shadow-lg border border-gray-200"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">10x</div>
            <div className="text-gray-600">Faster Approval Process</div>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">95%</div>
            <div className="text-gray-600">User Satisfaction Rate</div>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">24/7</div>
            <div className="text-gray-600">System Availability</div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need</h2>
            <p className="text-xl text-gray-600">Powerful features to manage your purchase requests efficiently</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Submission</h3>
              <p className="text-gray-600">
                Submit purchase requests in seconds with our intuitive form. Attach documents and track status in real-time.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Multi-Level Approval</h3>
              <p className="text-gray-600">
                Configure custom approval workflows based on amount, department, or item category.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-Time Reporting</h3>
              <p className="text-gray-600">
                Generate comprehensive reports and gain insights into spending patterns and trends.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🔔</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Notifications</h3>
              <p className="text-gray-600">
                Stay updated with email and in-app notifications for pending approvals and status changes.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Compliant</h3>
              <p className="text-gray-600">
                Enterprise-grade security with role-based access control and audit trails.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Mobile Ready</h3>
              <p className="text-gray-600">
                Access PurchaseGate from any device. Approve requests on-the-go with our responsive design.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* User Roles Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Built for Every Role</h2>
            <p className="text-xl text-gray-600">Tailored experiences for staff, approvers, and finance teams</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-3xl">👨‍💼</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">Staff Officers</h3>
              <ul className="space-y-2 text-gray-600">
                <li>✓ Submit purchase requests easily</li>
                <li>✓ Track request status in real-time</li>
                <li>✓ View request history</li>
                <li>✓ Receive instant notifications</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-3xl">✅</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">Approvers</h3>
              <ul className="space-y-2 text-gray-600">
                <li>✓ Review pending requests</li>
                <li>✓ Approve or reject with comments</li>
                <li>✓ Set approval priorities</li>
                <li>✓ Generate approval reports</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">Finance Team</h3>
              <ul className="space-y-2 text-gray-600">
                <li>✓ Process approved requests</li>
                <li>✓ Track budgets and spending</li>
                <li>✓ Generate financial reports</li>
                <li>✓ Manage vendor information</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-green-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Purchase Process?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Join organizations that trust PurchaseGate for their procurement needs
          </p>
          <Link
            to="/login"
            className="inline-block bg-white text-green-600 px-8 py-4 rounded-lg font-medium text-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            Sign In to Your Account →
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🛒</span>
                </div>
                <span className="ml-2 text-lg font-bold">PurchaseGate</span>
              </div>
              <p className="text-gray-400 text-sm">
                Streamlining purchase requests for modern organizations.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2025 PurchaseGate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}