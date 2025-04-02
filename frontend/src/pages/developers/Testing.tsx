import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertCircle,
  Code,
  FileDown,
  FileText,
  LayoutDashboard,
  LayoutGrid,
  Pencil,
  Settings,
  Wand2,
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Define the routes and their related information
const routes = {
  main: [
    {
      title: 'Dashboard',
      path: '/',
      description: 'Application homepage and dashboard',
      icon: <LayoutDashboard className="h-5 w-5 text-primary" />,
    },
    {
      title: 'Data Format Converter',
      path: '/data-format',
      description: 'Convert between JSON, YAML, and XML formats',
      icon: <FileDown className="h-5 w-5 text-primary" />,
    },
    {
      title: 'Data Format Docs',
      path: '/data-format/docs',
      description: 'Documentation for Data Format Converter',
      icon: <FileText className="h-5 w-5 text-primary" />,
    },
    {
      title: 'Regex Playground',
      path: '/regex-playground',
      description: 'Test and validate regular expressions',
      icon: <Wand2 className="h-5 w-5 text-primary" />,
    },
    {
      title: 'Regex Playground Docs',
      path: '/regex-playground/docs',
      description: 'Documentation for Regex Playground',
      icon: <FileText className="h-5 w-5 text-primary" />,
    },
  ],
  exceptions: [
    {
      title: 'Unauthorized (401)',
      path: '/401',
      description: 'Page unauthorized error page',
      icon: <AlertCircle className="h-5 w-5 text-red-500" />,
    },
    {
      title: 'Maintenance',
      path: '/maintenance',
      description: 'Page maintenance error page',
      icon: <AlertCircle className="h-5 w-5 text-red-500" />,
    },
    {
      title: 'Forbidden (403)',
      path: '/403',
      description: 'Access denied error page',
      icon: <AlertCircle className="h-5 w-5 text-orange-500" />,
    },
    {
      title: 'Not Found (404)',
      path: '/404',
      description: 'Page not found error page',
      icon: <AlertCircle className="h-5 w-5 text-red-500" />,
    },
    {
      title: 'Server Error (500)',
      path: '/500',
      description: 'Server error page',
      icon: <AlertCircle className="h-5 w-5 text-red-600" />,
    },
  ],
  utilities: [
    {
      title: 'Settings',
      path: '/settings',
      description: 'User settings and preferences',
      icon: <Settings className="h-5 w-5 text-gray-600" />,
    },
    {
      title: 'Editor',
      path: '/editor',
      description: 'Code editor component',
      icon: <Pencil className="h-5 w-5 text-gray-600" />,
    },
    {
      title: 'Component Showcase',
      path: '/components',
      description: 'UI component library showcase',
      icon: <LayoutGrid className="h-5 w-5 text-gray-600" />,
    },
  ],
};

export default function DevTestPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="container mx-auto max-w-6xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Developer Test Page</h1>
          <p className="text-gray-600 mb-6">
            Navigate to any page in the application for testing and development
          </p>

          <div className="flex justify-center mb-4">
            <Button asChild variant="outline" className="flex items-center gap-2">
              <Link to="/data-format">
                <Code className="h-4 w-4" />
                Back to Application
              </Link>
            </Button>
          </div>
        </header>

        <Tabs defaultValue="main" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="main">Main Pages</TabsTrigger>
            <TabsTrigger value="exceptions">Error Pages</TabsTrigger>
            <TabsTrigger value="utilities">Utilities</TabsTrigger>
          </TabsList>

          <TabsContent value="main">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {routes.main.map((route, index) => (
                <RouteCard key={index} route={route} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="exceptions">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {routes.exceptions.map((route, index) => (
                <RouteCard key={index} route={route} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="utilities">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {routes.utilities.map((route, index) => (
                <RouteCard key={index} route={route} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-12 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
            <div>
              <p className="text-blue-800">
                <strong>Developer Note:</strong> This page is intended for development and testing
                purposes only. Consider adding environment checks to prevent this from being
                accessible in production.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface RouteProps {
  route: {
    title: string;
    path: string;
    description: string;
    icon: React.ReactNode;
  };
}

function RouteCard({ route }: RouteProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xl">{route.title}</CardTitle>
        {route.icon}
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm">{route.description}</CardDescription>
      </CardContent>
      <CardFooter className="bg-gray-50 border-t pt-4">
        <Button asChild className="w-full">
          <Link to={route.path}>Navigate to {route.title}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
