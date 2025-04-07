// frontend/src/routes/index.tsx
import { Layout } from '@/components/layout/Layout';
import { Clock, FileCog, FileJson, FileText, Image, Regex, Zap } from 'lucide-react';
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
import PRSummaryGeneratorDocs from './../pages/documentation/PRSummaryGeneratorDocs';

// Auth pages
import RequireAuth from '@/context/RequireAuth';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';

// Developer pages
import DocumentationPage from '@/pages/DocumentationPage';
import Testing from '@/pages/developers/Testing';

// User page
import AIDebuggerPage from '@/pages/AIDebuggerPage';
import CronExpressionBuilder from '@/pages/CronExpressionBuilder';
import IssuePRSummaryGenerator from '@/pages/IssuePRSummaryGenerator';
import Profile from '@/pages/ProfilePage';
import { UUIDGenerator } from '@/pages/UUIDGenerator';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import LLMCarbonFootprint from '@/pages/llm-calculation/LLMCarbonFootprint';
import LLMCostCalculator from '@/pages/llm-calculation/LLMCostCalculator';
import { LLMDashboard } from '@/pages/llm-calculation/LLMDashboard';
import { LLMLeaderboard } from '@/pages/llm-calculation/LLMLeaderboard';
import LLMModelComparison from '@/pages/llm-calculation/LLMModelComparison';
import LLMParameterEstimator from '@/pages/llm-calculation/LLMParameterEstimator';
import LLMPromptEngineering from '@/pages/llm-calculation/LLMPromptEngineering';

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
        available: false,
      },
      {
        id: 'hash-generator',
        title: 'Hash Generator',
        description: 'Create MD5, SHA1, and SHA256 hashes',
        icon: <Zap className="h-10 w-10 mr-2" />,
        path: '/hash-generator',
        available: false,
      },
    ],
  },
  {
    category: 'Project & Collaboration Tools',
    tools: [
      {
        id: 'issue-pr-summary-generator',
        title: 'Issue & PR Summary Generator',
        description: 'Summarize GitHub/GitLab issues, PRs, and changes using AI',
        icon: <FileText className="h-10 w-10 mr-2" />,
        path: '/issue-pr-summary',
        available: true,
      },
      {
        id: 'documentation-auto-generator',
        title: 'Documentation Auto-Generator',
        description: 'Generate inline documentation and README files from code',
        icon: <FileCog className="h-10 w-10 mr-2" />,
        path: '/documentation-auto-generator',
        available: false,
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

  {
    category: 'Web & Network Tools',
    tools: [
      {
        id: 'api-tester',
        title: 'API Request Tester',
        description: 'Test API endpoints with different HTTP methods',
        icon: <Zap className="h-10 w-10 mr-2" />,
        path: '/api-tester',
        available: true,
      },
    ],
  },
  {
    category: 'Security Tools',
    tools: [
      {
        id: 'jwt-tool',
        title: 'JWT Encoder / Decoder',
        description: 'Inspect, verify, and create JWT tokens',
        icon: <FileJson className="h-10 w-10 mr-2" />,
        path: '/jwt-tool',
        available: false,
      },
      {
        id: 'hash-generator',
        title: 'Hash Generator',
        description: 'Create MD5, SHA1, and SHA256 hashes',
        icon: <Zap className="h-10 w-10 mr-2" />,
        path: '/hash-generator',
        available: false,
      },
    ],
  },

  {
    category: 'DevOps & Automation Tools',
    tools: [
      {
        id: 'dockerfile-generator',
        title: 'Dockerfile Generator & Optimizer',
        description: 'AI-assisted Dockerfile creation for better efficiency',
        icon: <FileCog className="h-10 w-10 mr-2" />,
        path: '/dockerfile-generator',
        available: false,
      },
      {
        id: 'ci-cd-config-generator',
        title: 'CI/CD Config Generator',
        description: 'Generate GitHub Actions, GitLab CI, or Jenkins pipelines with a simple UI',
        icon: <FileText className="h-10 w-10 mr-2" />,
        path: '/ci-cd-config-generator',
        available: false,
      },
    ],
  },

  {
    category: 'Productivity / Miscellaneous',
    tools: [
      {
        id: 'image-optimizer',
        title: 'Image Optimizer',
        description: 'Compress and resize images for the web',
        icon: <Image className="h-10 w-10 mr-2" />,
        path: '/image-optimizer',
        available: true,
      },
      {
        id: 'lorem-ipsum',
        title: 'Lorem Ipsum Generator',
        description: 'Generate placeholder text for UI designs and wireframes',
        icon: <FileText className="h-10 w-10 mr-2" />,
        path: '/lorem-ipsum',
        available: false,
      },
      {
        id: 'color-converter',
        title: 'Color Converter',
        description: 'Convert between HEX, RGB, HSL color formats',
        icon: <FileText className="h-10 w-10 mr-2" />,
        path: '/color-converter',
        available: false,
      },
      {
        id: 'diff-checker',
        title: 'Diff Checker',
        description: 'Compare two pieces of text to see the differences',
        icon: <FileText className="h-10 w-10 mr-2" />,
        path: '/diff-checker',
        available: false,
      },
    ],
  },
  {
    category: 'AI-Powered Features',
    tools: [
      {
        id: 'error-debugger',
        title: 'AI Debugger',
        description: 'AI-driven error detection and suggestions for bug fixing',
        icon: <FileCog className="h-10 w-10 mr-2" />,
        path: '/error-debugger',
        available: false,
      },
      {
        id: 'ai-test-generator',
        title: 'AI Test Case Generator',
        description: 'Generate unit test cases from your code automatically using AI',
        icon: <FileText className="h-10 w-10 mr-2" />,
        path: '/ai-test-generator',
        available: false,
      },
      {
        id: 'ai-stack-overflow-search',
        title: 'AI-Based Stack Overflow Search',
        description:
          'Automatically fetch relevant answers from Stack Overflow when an error occurs',
        icon: <FileText className="h-10 w-10 mr-2" />,
        path: '/stack-overflow-search',
        available: false,
      },
    ],
  },
  {
    category: 'AI-Tools',
    tools: [
      {
        id: 'llm-calculation',
        title: 'LLM Calculator',
        description:
          'Leverage large language models to analyze code, detect logical and syntax errors, and receive intelligent suggestions for debugging and optimization.',
        icon: <FileCog className="h-10 w-10 mr-2" />,
        path: '/llm-suites',
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
        path: '/image-optimizer',
        element: (
          <RequireAuth>
            <Suspense fallback={<Loader />}>
              <ImageOptimizerPage />
            </Suspense>
          </RequireAuth>
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
        path: '/api-tester',
        element: (
          <RequireAuth>
            <Suspense fallback={<Loader />}>
              <ApiRequestTesterPage />
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
        path: '/issue-pr-summary',
        element: (
          <RequireAuth>
            <Suspense fallback={<Loader />}>
              <IssuePRSummaryGenerator />
            </Suspense>
          </RequireAuth>
        ),
      },
      {
        path: '/ai-debugger',
        element: (
          <RequireAuth>
            <Suspense fallback={<Loader />}>
              <AIDebuggerPage />
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
        path: '/image-optimizer/docs',
        element: (
          <RequireAuth>
            <Suspense fallback={<Loader />}>
              <ImageOptimizerDocs />
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
      {
        path: '/api-tester/docs',
        element: (
          <RequireAuth>
            <Suspense fallback={<Loader />}>
              <ApiRequestTesterDocs />
            </Suspense>
          </RequireAuth>
        ),
      },
      {
        path: '/issue-pr-summary/docs',
        element: (
          <RequireAuth>
            <Suspense fallback={<Loader />}>
              <PRSummaryGeneratorDocs />
            </Suspense>
          </RequireAuth>
        ),
      },

      // Developer tools
      {
        path: '/testing',
        element: (
          <RequireAuth>
            <Suspense fallback={<Loader />}>
              <Testing />
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
      {
        path: '/admin-panel',
        element: (
          <RequireAuth>
            <Suspense fallback={<Loader />}>
              <AdminDashboard />
            </Suspense>
          </RequireAuth>
        ),
      },

      // LLM Models
      {
        path: '/llm-suites',
        element: (
          <RequireAuth>
            <Suspense fallback={<Loader />}>
              <LLMDashboard />
            </Suspense>
          </RequireAuth>
        ),
      },
      {
        path: '/llm-suites/llm-leaderboard',
        element: (
          <RequireAuth>
            <Suspense fallback={<Loader />}>
              <LLMLeaderboard />
            </Suspense>
          </RequireAuth>
        ),
      },
      {
        path: '/llm-suites/llm-cost-calculator',
        element: (
          <RequireAuth>
            <Suspense fallback={<Loader />}>
              <LLMCostCalculator />
            </Suspense>
          </RequireAuth>
        ),
      },
      {
        path: '/llm-suites/llm-parameter-estimator',
        element: (
          <RequireAuth>
            <Suspense fallback={<Loader />}>
              <LLMParameterEstimator />
            </Suspense>
          </RequireAuth>
        ),
      },
      {
        path: '/llm-suites/llm-carbon-footprint',
        element: (
          <RequireAuth>
            <Suspense fallback={<Loader />}>
              <LLMCarbonFootprint />
            </Suspense>
          </RequireAuth>
        ),
      },
      {
        path: '/llm-suites/llm-model-comparison',
        element: (
          <RequireAuth>
            <Suspense fallback={<Loader />}>
              <LLMModelComparison />
            </Suspense>
          </RequireAuth>
        ),
      },
      {
        path: '/llm-suites/llm-prompt-engineering',
        element: (
          <RequireAuth>
            <Suspense fallback={<Loader />}>
              <LLMPromptEngineering />
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
export const aiTools =
  toolCategories.filter(c => c.category.includes('AI'))?.flatMap(c => c.tools) || [];
