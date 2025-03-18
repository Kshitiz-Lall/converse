// frontend/src/pages/documentation/ApiRequestTesterDocs.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  ChevronsUpDown,
  Code,
  Download,
  FileText,
  Folder,
  History,
  Info,
  PlayCircle,
  Send,
  Settings,
  Shield,
  Upload,
  Zap,
} from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

// Define constants for reusable data
const TABS = [
  { value: 'overview', label: 'Overview' },
  { value: 'features', label: 'Features' },
  { value: 'environments', label: 'Environments' },
  { value: 'collections', label: 'Collections' },
  { value: 'best-practices', label: 'Best Practices' },
];

const QUICK_FACTS = [
  { label: 'Supported Methods', value: 'GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS' },
  { label: 'Request Body Formats', value: 'JSON, Raw Text, Form Data' },
  { label: 'Authentication', value: 'Bearer Token, Basic Auth, API Key' },
  { label: 'Import/Export', value: 'Postman, Insomnia' },
  { label: 'CORS Handling', value: 'Built-in CORS Proxy' },
];

const KEY_BENEFITS = [
  {
    title: 'Browser-Based Testing',
    description:
      'Test API endpoints directly from your browser without installing additional software.',
  },
  {
    title: 'Request History',
    description: 'Automatically save your request history for future reference.',
  },
  {
    title: 'Collections',
    description: 'Save and organize frequently used requests into collections.',
  },
  {
    title: 'Environments',
    description:
      'Define environments with variables for easy switching between development, staging, and production.',
  },
  {
    title: 'CORS Handling',
    description: 'Built-in proxy to bypass CORS restrictions when testing APIs.',
  },
];

const FEATURES = [
  {
    icon: <Send />,
    title: 'Request Builder',
    subtitle: 'Create and customize HTTP requests',
    description:
      'The request builder provides an intuitive interface to construct API requests. You can select the HTTP method, enter the URL, add headers, query parameters, and customize the request body.',
  },
  {
    icon: <Code />,
    title: 'Response Viewer',
    subtitle: 'View and analyze API responses',
    description:
      'The response viewer displays the API response with syntax highlighting, including the status code, headers, response time, and body. You can easily copy or download the response for further analysis.',
  },
  {
    icon: <History />,
    title: 'Request History',
    subtitle: 'Track and reuse past requests',
    description:
      'Every request you make is automatically saved to your history. You can easily view, search, and reuse past requests. This helps you track your API testing progress and prevents you from having to recreate complex requests.',
  },
  {
    icon: <Settings />,
    title: 'Environments',
    subtitle: 'Manage variables across different environments',
    description:
      'Create and manage environments to store variables for different contexts like development, staging, and production. Use these variables in your requests using {{variableName}} syntax for easy switching between environments.',
  },
  {
    icon: <Folder />,
    title: 'Collections',
    subtitle: 'Organize and save requests',
    description:
      'Save your frequently used requests into collections for easy access. Organize collections by project, API, or any other logical grouping. Import and export collections to share with team members.',
  },
  {
    icon: <ChevronsUpDown />,
    title: 'Import/Export',
    subtitle: 'Share collections and environments',
    description:
      'Import and export collections in formats compatible with popular API tools like Postman and Insomnia. This makes it easy to share your API testing setup with teammates or move between different tools.',
  },
];

const ENVIRONMENT_EXAMPLES = [
  { field: 'URL', example: 'https://api.{{domain}}.com/users/{{userId}}' },
  { field: 'Headers', example: 'Authorization: Bearer {{accessToken}}\nx-api-key: {{apiKey}}' },
  { field: 'Query Parameters', example: '?userId={{userId}}&version={{apiVersion}}' },
  {
    field: 'Request Body',
    example:
      '{\n  "user": "{{username}}",\n  "token": "{{authToken}}",\n  "tenant": "{{tenantId}}"\n}',
  },
];

const ENVIRONMENT_TYPES = [
  {
    name: 'Development',
    baseUrl: 'http://localhost:3000/api',
    purpose: 'Local development and testing',
  },
  {
    name: 'Staging',
    baseUrl: 'https://staging-api.example.com',
    purpose: 'Pre-production testing',
  },
  { name: 'Production', baseUrl: 'https://api.example.com', purpose: 'Live environment' },
];

const USER_API_REQUESTS = [
  { method: 'GET', endpoint: '/api/users', title: 'Get All Users', color: 'green' },
  { method: 'GET', endpoint: '/api/users/{{userId}}', title: 'Get User by ID', color: 'blue' },
  { method: 'POST', endpoint: '/api/users', title: 'Create New User', color: 'yellow' },
  { method: 'PUT', endpoint: '/api/users/{{userId}}', title: 'Update User', color: 'purple' },
  { method: 'DELETE', endpoint: '/api/users/{{userId}}', title: 'Delete User', color: 'red' },
];

const COLLECTION_ACTIONS = [
  {
    icon: <Folder />,
    title: 'Creating a Collection',
    steps: [
      'Click on the "Collections" tab in the sidebar',
      'Click the "New Collection" button',
      'Enter a name and optional description',
      'Click "Create" to save the collection',
    ],
  },
  {
    icon: <Send />,
    title: 'Adding Requests to Collections',
    steps: [
      'Create a new request or select one from history',
      'Click the "Save" button',
      'Select a collection from the dropdown or create a new one',
      'Enter a name for the request and click "Save"',
    ],
  },
];

const COLLECTION_MANAGEMENT = [
  {
    icon: <Download />,
    title: 'Exporting Collections',
    steps: [
      'Go to the Collections tab',
      'Find the collection you want to export',
      'Click the "..." menu button and select "Export"',
      'Choose the format (Postman Collection v2.1)',
      'The collection file will be downloaded to your device',
    ],
  },
  {
    icon: <Upload />,
    title: 'Importing Collections',
    steps: [
      'Go to the Collections tab',
      'Click the "Import" button',
      'Select the collection file (Postman or Insomnia format)',
      'Review the import summary',
      'Click "Import" to add the collection',
    ],
  },
];

const BEST_PRACTICES = [
  {
    title: 'Organize Your Requests',
    description:
      'Create logical collections for different APIs or projects. Within collections, group requests by endpoint type or feature area. This makes it easier to find and reuse requests, especially when working with large APIs.',
  },
  {
    title: 'Use Environment Variables',
    description:
      'Store base URLs, API keys, tokens, and other frequently used values as environment variables. This allows you to easily switch between development, staging, and production environments without modifying your requests.',
  },
  {
    title: 'Document Your Requests',
    description:
      'Add clear descriptions to your collections and requests. Include information about expected inputs, potential responses, and any special requirements or edge cases. This helps team members understand the purpose and usage of each request.',
  },
  {
    title: 'Create Test Sequences',
    description:
      'Organize your collections to follow common usage patterns or user journeys. For example, a collection might include requests to create a resource, retrieve it, update it, and then delete it - in that order. This helps validate end-to-end workflows.',
  },
  {
    title: 'Maintain Authentication',
    description:
      'Store authentication tokens in environment variables and update them regularly. For APIs with short-lived tokens, create a separate "Authentication" collection with requests that obtain and refresh tokens.',
  },
];

const SECURITY_CONSIDERATIONS = [
  {
    icon: <Shield />,
    title: 'Never Store Sensitive Data in Collections',
    description:
      'Avoid storing production passwords, personal access tokens, or sensitive customer data in your collections or environments, especially when sharing collections with teammates.',
  },
  {
    icon: <AlertCircle />,
    title: 'Be Careful with Production APIs',
    description:
      'When testing against production environments, take extra care with destructive operations like POST, PUT, and DELETE. Consider creating test data that can be safely modified.',
  },
  {
    icon: <FileText />,
    title: 'Sanitize Response Data',
    description:
      'When sharing API responses with teammates, ensure that sensitive information is removed or redacted, especially when troubleshooting issues.',
  },
  {
    icon: <BookOpen />,
    title: 'Follow API Rate Limits',
    description:
      'Be mindful of API rate limits, especially when running multiple requests in succession. Some APIs may temporarily block your access if you exceed rate limits.',
  },
];

const COLLABORATION_TIPS = [
  {
    title: 'Standardized Naming',
    description:
      'Establish consistent naming conventions for collections, requests, and variables to make it easier for team members to understand and work with shared collections.',
  },
  {
    title: 'Documentation Sharing',
    description:
      'Use collections as living API documentation by adding detailed descriptions and examples. This can be especially valuable for onboarding new team members.',
  },
  {
    title: 'Environment Templates',
    description:
      'Create environment templates with placeholder values that team members can use as a starting point, while keeping their actual credentials private.',
  },
];

export default function ApiRequestTesterDocs() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto p-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/api-tester"
            className="flex items-center text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span>Back to API Request Tester</span>
          </Link>
          <h1 className="text-3xl font-bold text-center">API Request Tester Documentation</h1>
          <div className="w-32"></div> {/* Spacer for balance */}
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            {TABS.map(tab => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-4">What is API Request Tester?</h2>
                    <p className="mb-4 text-gray-700">
                      API Request Tester is a powerful tool designed to help developers test, debug,
                      and work with RESTful APIs directly from the browser. It offers a simple and
                      intuitive interface to construct HTTP requests, view responses, and save
                      frequently used requests for future use.
                    </p>
                    <p className="mb-4 text-gray-700">
                      Whether you're developing new APIs, integrating with third-party services, or
                      debugging API issues, this tool provides all the functionality you need
                      without requiring desktop software installation.
                    </p>

                    <h3 className="text-xl font-semibold mt-6 mb-3">Key Benefits</h3>
                    <ul className="list-disc pl-5 space-y-2 mb-6 text-gray-700">
                      {KEY_BENEFITS.map((benefit, index) => (
                        <li key={index}>
                          <strong>{benefit.title}:</strong> {benefit.description}
                        </li>
                      ))}
                    </ul>

                    <Button asChild className="mt-4">
                      <Link to="/api-tester">
                        <Zap className="mr-2 h-4 w-4" />
                        Try API Request Tester
                      </Link>
                    </Button>
                  </div>

                  <div className="md:w-1/3 bg-gray-100 rounded-lg p-5">
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <Code className="h-5 w-5 mr-2 text-primary" />
                      Quick Facts
                    </h3>
                    <ul className="space-y-4">
                      {QUICK_FACTS.map((fact, index) => (
                        <li
                          key={index}
                          className={
                            index < QUICK_FACTS.length - 1 ? 'border-b border-gray-200 pb-2' : ''
                          }
                        >
                          <p className="text-sm text-gray-500">{fact.label}</p>
                          <p className="font-medium">{fact.value}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-6">Key Features</h2>

                <div className="grid md:grid-cols-2 gap-6">
                  {FEATURES.map((feature, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-5 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start mb-3">
                        <div className="rounded-full bg-primary/10 p-2 mr-3">
                          {React.cloneElement(feature.icon, { className: 'h-5 w-5 text-primary' })}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{feature.title}</h3>
                          <p className="text-gray-600 text-sm">{feature.subtitle}</p>
                        </div>
                      </div>
                      <p className="text-gray-700">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Environments Tab */}
          <TabsContent value="environments">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4">Working with Environments</h2>
                <p className="mb-6 text-gray-700">
                  Environments allow you to define sets of variables that can be used across
                  different requests. This is especially useful when working with APIs that require
                  different settings for development, staging, and production environments.
                </p>

                <h3 className="text-xl font-semibold mb-3">Using Environment Variables</h3>
                <p className="mb-4 text-gray-700">
                  You can reference environment variables in your requests using double curly braces
                  notation: <code>{'{{variableName}}'}</code>. These variables can be used in:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {ENVIRONMENT_EXAMPLES.map((example, index) => (
                    <div key={index} className="bg-gray-100 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">{example.field}</h4>
                      <div className="bg-white p-3 rounded font-mono text-sm whitespace-pre-line">
                        {example.example}
                      </div>
                    </div>
                  ))}
                </div>

                <h3 className="text-xl font-semibold mb-3">Creating Environments</h3>
                <p className="mb-4 text-gray-700">To create a new environment:</p>
                <ol className="list-decimal pl-5 space-y-1 mb-6 text-gray-700">
                  <li>Click on the "Environments" tab in the sidebar</li>
                  <li>Click the "New" button</li>
                  <li>Enter a name for your environment (e.g., "Development", "Production")</li>
                  <li>Add variables with their corresponding values</li>
                  <li>Click "Create" to save the environment</li>
                </ol>

                <h3 className="text-xl font-semibold mb-3">Managing Multiple Environments</h3>
                <p className="mb-4 text-gray-700">
                  You can create multiple environments for different contexts:
                </p>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Environment</TableHead>
                      <TableHead>Base URL Example</TableHead>
                      <TableHead>Purpose</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ENVIRONMENT_TYPES.map((env, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{env.name}</TableCell>
                        <TableCell>{env.baseUrl}</TableCell>
                        <TableCell>{env.purpose}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <p className="mt-4 text-gray-700">
                  You can easily switch between environments by clicking the "Use" button next to
                  the environment name in the Environments panel.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Collections Tab */}
          <TabsContent value="collections">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4">Working with Collections</h2>
                <p className="mb-6 text-gray-700">
                  Collections help you organize related requests together for easier management and
                  reuse. They are ideal for grouping requests by project, API endpoint categories,
                  or testing scenarios.
                </p>

                <h3 className="text-xl font-semibold mb-3">Creating and Managing Collections</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {COLLECTION_ACTIONS.map((action, index) => (
                    <div key={index} className="border rounded-lg p-5">
                      <h4 className="font-semibold mb-2 flex items-center">
                        {React.cloneElement(action.icon, {
                          className: 'h-4 w-4 mr-2 text-primary',
                        })}
                        {action.title}
                      </h4>
                      <ol className="list-decimal pl-5 space-y-1 text-gray-700">
                        {action.steps.map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  ))}
                </div>

                <h3 className="text-xl font-semibold mb-3">Organizing API Requests</h3>
                <p className="mb-4 text-gray-700">
                  An effective way to organize collections is by API domain or feature. Here's an
                  example structure:
                </p>

                <div className="bg-gray-100 p-4 rounded-lg mb-6">
                  <h4 className="font-semibold mb-2">User Management API</h4>
                  <ul className="space-y-3 pl-4">
                    {USER_API_REQUESTS.map((request, index) => (
                      <li key={index} className="flex items-start">
                        <PlayCircle className={`h-4 w-4 mt-1 mr-2 text-${request.color}-600`} />
                        <div>
                          <div className="font-medium">{request.title}</div>
                          <div className="text-xs text-gray-500">
                            {request.method} {request.endpoint}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <h3 className="text-xl font-semibold mb-3">Importing and Exporting Collections</h3>
                <p className="mb-4 text-gray-700">
                  Share your collections with team members or migrate from other API tools:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {COLLECTION_MANAGEMENT.map((action, index) => (
                    <div key={index} className="border rounded-lg p-5">
                      <h4 className="font-semibold mb-2 flex items-center">
                        {React.cloneElement(action.icon, {
                          className: 'h-4 w-4 mr-2 text-primary',
                        })}
                        {action.title}
                      </h4>
                      <p className="text-gray-700 mb-2">To {action.title.toLowerCase()}:</p>
                      <ol className="list-decimal pl-5 space-y-1 text-gray-700">
                        {action.steps.map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  ))}
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-blue-800">
                        <strong>Tip:</strong> Collections can be used with environment variables for
                        maximum flexibility. This allows you to reuse the same collection across
                        different environments by simply changing the active environment.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Best Practices Tab */}
          <TabsContent value="best-practices">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-6">Best Practices for API Testing</h2>

                <div className="space-y-6">
                  {BEST_PRACTICES.map((practice, index) => (
                    <div key={index} className="border-l-4 border-primary pl-4 py-1">
                      <h3 className="text-lg font-semibold mb-2">{practice.title}</h3>
                      <p className="text-gray-700">{practice.description}</p>
                    </div>
                  ))}
                </div>

                <h3 className="text-xl font-semibold mt-8 mb-4">Security Considerations</h3>
                <div className="bg-gray-100 rounded-lg p-5 mb-6">
                  <ul className="space-y-4">
                    {SECURITY_CONSIDERATIONS.map((item, index) => (
                      <li key={index} className="flex items-start">
                        {React.cloneElement(item.icon, {
                          className: 'h-5 w-5 text-primary mr-3 mt-0.5',
                        })}
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-gray-600">{item.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <h3 className="text-xl font-semibold mb-4">Collaborative Testing</h3>
                <p className="mb-4 text-gray-700">
                  When working in teams, consider these additional tips:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {COLLABORATION_TIPS.map((tip, index) => (
                    <div key={index} className="border rounded-lg p-5">
                      <h4 className="font-semibold mb-2">{tip.title}</h4>
                      <p className="text-gray-700">{tip.description}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r mt-6">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-yellow-800">
                        <strong>Important:</strong> When testing APIs that modify data (e.g., POST,
                        PUT, DELETE), always verify you're working with the intended environment
                        before executing requests. A simple test using a GET request first can help
                        prevent accidental changes to production data.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
