// frontend/src/routes/index.tsx
import { Layout } from '@/components/layout/Layout';
import { Clock, FileCode2, FileCog, FileJson, FileText, Image, Regex, Zap } from 'lucide-react';
import { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';

// Main app components
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const DataFormatPage = lazy(() => import('@/pages/DataFormatPage'));
const ImageOptimizerPage = lazy(() => import('@/pages/ImageOptimizerPage'));
const RegexPlaygroundPage = lazy(() => import('@/pages/RegexPlaygroundPage'));
const ApiRequestTesterPage = lazy(() => import('@/pages/ApiRequestTesterPage'));

// Exception pages
const NotFound = lazy(() => import('@/pages/exceptions/NotFound'));
const ServerError = lazy(() => import('@/pages/exceptions/ServerError'));
const Unauthorized = lazy(() => import('@/pages/exceptions/Unauthorized'));
const Forbidden = lazy(() => import('@/pages/exceptions/Forbidden'));
const Maintenance = lazy(() => import('@/pages/exceptions/Maintenance'));

// Documentation pages
import ApiRequestTesterDocs from '@/pages/documentation/ApiRequestTesterDocs';
import DataFormatConverterDocs from '@/pages/documentation/DataFormatConverterDoc';
import RegexPlaygroundDocs from '@/pages/documentation/RegexPlaygroundDocs';
import ImageOptimizerDocs from './../pages/documentation/ImageOptimizerDoc';

import LandingPage from '@/pages/LandingPage';
import SignupPage from '@/pages/auth/SignupPage';
import LoginPage from '@/pages/auth/LoginPage';

// Centralized tool configurations
export const devTools = [
  {
    id: 'data-format-converter',
    title: 'Data Format Converter',
    description: 'Convert between JSON, YAML, and XML formats',
    icon: <FileJson className="h-10 w-10 mr-2" />,
    path: '/data-format',
    available: true,
  },
  {
    id: 'image-optimizer',
    title: 'Image Optimizer',
    description: 'Compress and resize images for the web',
    icon: <Image className="h-10 w-10 mr-2" />,
    path: '/image-optimizer',
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
    id: 'api-tester',
    title: 'API Request Tester',
    description: 'Test API endpoints with different HTTP methods',
    icon: <Zap className="h-10 w-10 mr-2" />,
    path: '/api-tester',
    available: true,
  },
  {
    id: 'cron-builder',
    title: 'Cron Expression Builder',
    description: 'Build and validate cron expressions',
    icon: <Clock className="h-10 w-10 mr-2" />,
    path: '/cron-builder',
    available: false,
  },
];

export const aiTools = [
  // AI-Powered Features
  {
    id: 'error-debugger',
    title: 'AI Debugger',
    description: 'AI-driven error detection and suggestions for bug fixing',
    icon: <FileCog className="h-10 w-10 mr-2" />,
    path: '/error-debugger',
    available: false,
    category: 'AI-Powered Features',
  },
  {
    id: 'ai-test-generator',
    title: 'AI Test Case Generator',
    description: 'Generate unit test cases from your code automatically using AI',
    icon: <FileText className="h-10 w-10 mr-2" />,
    path: '/ai-test-generator',
    available: false,
    category: 'AI-Powered Features',
  },
  {
    id: 'automated-code-refactoring',
    title: 'Automated Code Refactoring',
    description: 'Detect messy code and suggest or auto-apply cleanups following best practices.',
    icon: <FileCode2 className="h-10 w-10 mr-2" />,
    path: '/automated-refactoring',
    available: false,
    category: 'AI-Powered Features',
  },
  {
    id: 'ai-stack-overflow-search',
    title: 'AI-Based Stack Overflow Search',
    description: 'Automatically fetch relevant answers from Stack Overflow when an error occurs.',
    icon: <FileText className="h-10 w-10 mr-2" />,
    path: '/stack-overflow-search',
    available: false,
    category: 'AI-Powered Features',
  },

  // Project & Collaboration Tools
  {
    id: 'issue-pr-summary-generator',
    title: 'Issue & PR Summary Generator',
    description: 'Summarize GitHub/GitLab issues, PRs, and changes using AI.',
    icon: <FileText className="h-10 w-10 mr-2" />,
    path: '/issue-pr-summary',
    available: false,
    category: 'Project & Collaboration Tools',
  },
  {
    id: 'documentation-auto-generator',
    title: 'Documentation Auto-Generator',
    description: 'Generate inline documentation and README files from code.',
    icon: <FileCog className="h-10 w-10 mr-2" />,
    path: '/documentation-auto-generator',
    available: false,
    category: 'Project & Collaboration Tools',
  },

  // DevOps & Automation Tools
  {
    id: 'dockerfile-generator',
    title: 'Dockerfile Generator & Optimizer',
    description: 'AI-assisted Dockerfile creation for better efficiency.',
    icon: <FileCog className="h-10 w-10 mr-2" />,
    path: '/dockerfile-generator',
    available: false,
    category: 'DevOps & Automation Tools',
  },
  {
    id: 'ci-cd-config-generator',
    title: 'CI/CD Config Generator',
    description: 'Generate GitHub Actions, GitLab CI, or Jenkins pipelines with a simple UI.',
    icon: <FileText className="h-10 w-10 mr-2" />,
    path: '/ci-cd-config-generator',
    available: false,
    category: 'DevOps & Automation Tools',
  },
  {
    id: 'server-log-analyzer',
    title: 'Server Log Analyzer',
    description: 'AI-powered insights on log patterns, errors, and optimization tips.',
    icon: <FileCog className="h-10 w-10 mr-2" />,
    path: '/server-log-analyzer',
    available: false,
    category: 'DevOps & Automation Tools',
  },
];

// Loading component for suspense fallback
const Loader = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
  </div>
);

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
      {
        path: '/image-optimizer',
        element: (
          <Suspense fallback={<Loader />}>
            <ImageOptimizerPage />
          </Suspense>
        ),
      },
      {
        path: '/regex-playground',
        element: (
          <Suspense fallback={<Loader />}>
            <RegexPlaygroundPage />
          </Suspense>
        ),
      },
      {
        path: '/api-tester',
        element: (
          <Suspense fallback={<Loader />}>
            <ApiRequestTesterPage />
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
        path: '/file-diff',
        element: (
          <Suspense fallback={<Loader />}>
            <Maintenance />
          </Suspense>
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
        path: '/image-optimizer/docs',
        element: (
          <Suspense fallback={<Loader />}>
            <ImageOptimizerDocs />
          </Suspense>
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
          <Suspense fallback={<Loader />}>
            <RegexPlaygroundDocs />
          </Suspense>
        ),
      },
      {
        path: '/api-tester/docs',
        element: <Suspense fallback={<Loader />}>{<ApiRequestTesterDocs />}</Suspense>,
      },
    ],
  },
];
