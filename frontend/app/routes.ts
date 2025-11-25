import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('login', 'routes/login.tsx'),
  route('dashboard', 'routes/dashboard.tsx'),
  route('dashboard.profile', 'routes/dashboard.profile.tsx'),
  route('dashboard.new-request', 'routes/dashboard.new-request.tsx'),
  route('dashboard.my-requests', 'routes/dashboard.my-requests.tsx'),
  route('dashboard.pending-requests', 'routes/dashboard.pending-requests.tsx'),
  route('dashboard.approved-requests', 'routes/dashboard.approved-requests.tsx'),
  route('dashboard.all-requests', 'routes/dashboard.all-requests.tsx'),
  route('dashboard.reports', 'routes/dashboard.reports.tsx'),
  // route('dashboard.settings', 'routes/dashboard.settings.tsx'),
  // route('not-found', 'routes/not-found.tsx'),
  // Add more routes as needed
] satisfies RouteConfig;