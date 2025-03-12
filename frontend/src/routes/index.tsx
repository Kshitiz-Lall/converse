// src/routes/index.tsx
import { lazy, Suspense } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';
import { Layout } from '@/components/layout/Layout';

// Main app components
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const DataFormatPage = lazy(() => import('@/pages/DataFormatPage'));

// Exception pages
const NotFound = lazy(() => import('@/pages/exceptions/NotFound'));
const ServerError = lazy(() => import('@/pages/exceptions/ServerError'));
const Unauthorized = lazy(() => import('@/pages/exceptions/Unauthorized'));
const Forbidden = lazy(() => import('@/pages/exceptions/Forbidden'));
const Maintenance = lazy(() => import('@/pages/exceptions/Maintenance'));

// Loading component for suspense fallback
const Loader = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
  </div>
);

// Auth guard component - removed for now
// Keeping this commented code for future reference when you're ready to add auth
/*
const RequireAuth = ({ children }: { children: JSX.Element }) => {
  // Replace with your actual auth check logic
  const isAuthenticated = localStorage.getItem('token') !== null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
*/

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      // Main application routes
      {
        path: '/',
        element: (
          <Suspense fallback={<Loader />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: '/data-format',
        element: (
          <Suspense fallback={<Loader />}>
            <DataFormatPage />
          </Suspense>
        ),
      },
      // Future tool routes will go here
      {
        path: '/image-optimizer',
        element: (
          <Suspense fallback={<Loader />}>
            <Maintenance />
          </Suspense>
        ),
      },
      {
        path: '/regex',
        element: (
          <Suspense fallback={<Loader />}>
            <Maintenance />
          </Suspense>
        ),
      },
      {
        path: '/code-formatter',
        element: (
          <Suspense fallback={<Loader />}>
            <Maintenance />
          </Suspense>
        ),
      },
      {
        path: '/grid-generator',
        element: (
          <Suspense fallback={<Loader />}>
            <Maintenance />
          </Suspense>
        ),
      },
      {
        path: '/cron-builder',
        element: (
          <Suspense fallback={<Loader />}>
            <Maintenance />
          </Suspense>
        ),
      },
      {
        path: '/markdown',
        element: (
          <Suspense fallback={<Loader />}>
            <Maintenance />
          </Suspense>
        ),
      },
      {
        path: '/api-tester',
        element: (
          <Suspense fallback={<Loader />}>
            <Maintenance />
          </Suspense>
        ),
      },
      {
        path: '/file-diff',
        element: (
          <Suspense fallback={<Loader />}>
            <Maintenance />
          </Suspense>
        ),
      },

      // Auth routes (inside layout for consistent navigation)
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/signup',
        element: <SignupPage />,
      },
      {
        path: '/forgot-password',
        element: <div>Forgot Password Page</div>, // Replace with actual component when created
      },

      // Exception routes
      {
        path: '/500',
        element: (
          <Suspense fallback={<Loader />}>
            <ServerError />
          </Suspense>
        ),
      },
      {
        path: '/401',
        element: (
          <Suspense fallback={<Loader />}>
            <Unauthorized />
          </Suspense>
        ),
      },
      {
        path: '/403',
        element: (
          <Suspense fallback={<Loader />}>
            <Forbidden />
          </Suspense>
        ),
      },
      {
        path: '/maintenance',
        element: (
          <Suspense fallback={<Loader />}>
            <Maintenance />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<Loader />}>
            <NotFound />
          </Suspense>
        ),
      },
    ],
  },
];
