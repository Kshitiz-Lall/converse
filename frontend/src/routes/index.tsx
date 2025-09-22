// frontend/src/routes/index.tsx
import { Layout } from '@/components/layout/Layout';
import { Clock, FileCog, FileJson, Regex } from 'lucide-react';
import { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';

// Main app components
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const DataFormatPage = lazy(() => import('@/pages/DataFormatPage'));
const RegexPlaygroundPage = lazy(() => import('@/pages/RegexPlaygroundPage'));
const JWTToolPage = lazy(() => import('@/pages/JWTToolPage'));

// Exception pages
const NotFound = lazy(() => import('@/pages/exceptions/NotFound'));
const ServerError = lazy(() => import('@/pages/exceptions/ServerError'));
const Unauthorized = lazy(() => import('@/pages/exceptions/Unauthorized'));
const Forbidden = lazy(() => import('@/pages/exceptions/Forbidden'));
const Maintenance = lazy(() => import('@/pages/exceptions/Maintenance'));

// Documentation pages
import DataFormatConverterDocs from '@/pages/documentation/DataFormatConverterDoc';
import RegexPlaygroundDocs from '@/pages/documentation/RegexPlaygroundDocs';

// Auth pages
import RequireAuth from '@/context/RequireAuth';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';

// Developer pages
import DocumentationPage from '@/pages/DocumentationPage';

// User page
import CronExpressionBuilder from '@/pages/CronExpressionBuilder';
import Profile from '@/pages/ProfilePage';
import { UUIDGenerator } from '@/pages/UUIDGenerator';

// Loading component for suspense fallback
const Loader = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
  </div>
);

export const toolCategories = [
  {
    category: 'Code Utilities',
    tools: [
      {
        id: 'data-format-converter',
        title: 'Data Format Converter',
        description: 'Convert between JSON, YAML, and XML formats',
        icon: <FileJson className="h-10 w-10 mr-2" />,
        path: '/data-format',
        available: true,
      },
      {
        id: 'regex-playground',
        title: 'Regex Playground',
        description: 'Test and validate regular expressions',
        icon: <Regex className="h-10 w-10 mr-2" />,
        path: '/regex-playground',
        available: true,
      },
      {
        id: 'uuid-generator',
        title: 'UUID Generator',
        description: 'Generate UUIDs (v1, v4) for testing and development',
        icon: <FileCog className="h-10 w-10 mr-2" />,
        path: '/uuid-generator',
        available: true,
      },
      {
        id: 'jwt-tool',
        title: 'JWT Encoder / Decoder',
        description: 'Inspect, verify, and create JWT tokens',
        icon: <FileJson className="h-10 w-10 mr-2" />,
        path: '/jwt-tool',
        available: true,
      },
    ],
  },
  {
    category: 'Data and Database Tools',
    tools: [
      {
        id: 'cron-builder',
        title: 'Cron Expression Builder',
        description: 'Build and validate cron expressions',
        icon: <Clock className="h-10 w-10 mr-2" />,
        path: '/cron-builder',
        available: true,
      },
    ],
  },
];

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
            <LandingPage />
          </Suspense>
        ),
      },
      {
        path: '/login',
        element: (
          <Suspense fallback={<Loader />}>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        path: '/signup',
        element: (
          <Suspense fallback={<Loader />}>
            <SignupPage />
          </Suspense>
        ),
      },
      {
        path: '/dashboard',
        element: (
          <RequireAuth>
            <Suspense fallback={<Loader />}>
              <Dashboard />
            </Suspense>
          </RequireAuth>
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
      {
        path: '/regex-playground',
        element: (
          <RequireAuth>
            <Suspense fallback={<Loader />}>
              <RegexPlaygroundPage />
            </Suspense>
          </RequireAuth>
        ),
      },
      {
        path: '/cron-builder',
        element: (
          <RequireAuth>
            <Suspense fallback={<Loader />}>
              <CronExpressionBuilder />
            </Suspense>
          </RequireAuth>
        ),
      },
      {
        path: '/uuid-generator',
        element: (
          <RequireAuth>
            <Suspense fallback={<Loader />}>
              <UUIDGenerator />
            </Suspense>
          </RequireAuth>
        ),
      },
      {
        path: '/jwt-tool',
        element: (
          <RequireAuth>
            <Suspense fallback={<Loader />}>
              <JWTToolPage />
            </Suspense>
          </RequireAuth>
        ),
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

      // Documentation
      {
        path: '/documentation',
        element: (
          <RequireAuth>
            <Suspense fallback={<Loader />}>
              <DocumentationPage />
            </Suspense>
          </RequireAuth>
        ),
      },
      {
        path: '/data-format/docs',
        element: (
          <Suspense fallback={<Loader />}>
            <DataFormatConverterDocs />
          </Suspense>
        ),
      },
      {
        path: '/regex-playground/docs',
        element: (
          <RequireAuth>
            <Suspense fallback={<Loader />}>
              <RegexPlaygroundDocs />
            </Suspense>
          </RequireAuth>
        ),
      },

      // Developer tools
      {
        path: '/profile',
        element: (
          <RequireAuth>
            <Suspense fallback={<Loader />}>
              <Profile />
            </Suspense>
          </RequireAuth>
        ),
      },
    ],
  },
];

// Add these helper exports at the bottom
export const allTools = toolCategories.flatMap(category => category.tools);
export const devTools = toolCategories.find(c => c.category === 'Code Utilities')?.tools || [];
