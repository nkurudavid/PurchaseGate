import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('login', 'routes/login.tsx'),
  
  // Dashboard parent route with nested children
  route('dashboard', 'routes/dashboard.tsx', [
    index('routes/dashboard._index.tsx'),
    route('profile', 'routes/dashboard.profile.tsx'),
    route('new-request', 'routes/dashboard.new-request.tsx'),
    route('my-requests', 'routes/dashboard.my-requests.tsx'),
    route('pending-requests', 'routes/dashboard.pending-requests.tsx'),
    route('approved-requests', 'routes/dashboard.approved-requests.tsx'),
    route('all-requests', 'routes/dashboard.all-requests.tsx'),
    route('reports', 'routes/dashboard.reports.tsx'),
  ]),
  
  // Catch-all 404 route
  route('*', 'routes/not-found.tsx'),
] satisfies RouteConfig;