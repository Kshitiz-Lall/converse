import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ArrowRightIcon,
  Clock,
  FileCode2,
  FileCog,
  FileJson,
  FileText,
  Grid3X3,
  Image,
  RefreshCw,
  Regex,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DevTools = [
  {
    id: 'data-format-converter',
    title: 'Data Format Converter',
    description: 'Convert between JSON, YAML, and XML formats easily',
    icon: <FileJson className="h-12 w-12 text-primary" />,
    path: '/data-format',
    available: true,
  },
  {
    id: 'image-optimizer',
    title: 'Image Optimizer',
    description: 'Compress and resize images for the web',
    icon: <Image className="h-12 w-12 text-primary" />,
    path: '/image-optimizer',
    available: true,
  },
  {
    id: 'regex-playground',
    title: 'Regex Playground',
    description: 'Test and validate regular expressions',
    icon: <Regex className="h-12 w-12 text-muted-foreground" />,
    path: '/regex',
    available: false,
  },
  {
    id: 'code-formatter',
    title: 'Code Formatter',
    description: 'Format and beautify your code',
    icon: <FileCode2 className="h-12 w-12 text-muted-foreground" />,
    path: '/code-formatter',
    available: false,
  },
  {
    id: 'css-grid-generator',
    title: 'CSS Grid Generator',
    description: 'Visual tool to generate CSS grid layouts',
    icon: <Grid3X3 className="h-12 w-12 text-muted-foreground" />,
    path: '/grid-generator',
    available: false,
  },
  {
    id: 'cron-builder',
    title: 'Cron Expression Builder',
    description: 'Create and validate cron job expressions',
    icon: <Clock className="h-12 w-12 text-muted-foreground" />,
    path: '/cron-builder',
    available: false,
  },
  {
    id: 'markdown-editor',
    title: 'Markdown Editor',
    description: 'Write and preview markdown documents',
    icon: <FileText className="h-12 w-12 text-muted-foreground" />,
    path: '/markdown',
    available: false,
  },
  {
    id: 'api-tester',
    title: 'API Request Tester',
    description: 'Test API endpoints with different HTTP methods',
    icon: <RefreshCw className="h-12 w-12 text-muted-foreground" />,
    path: '/api-tester',
    available: false,
  },
  {
    id: 'file-diff',
    title: 'File Diff Tool',
    description: 'Compare files and see the differences',
    icon: <FileCog className="h-12 w-12 text-muted-foreground" />,
    path: '/file-diff',
    available: false,
  },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-12 px-4">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Developer Toolkit</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A collection of essential tools for web developers and programmers
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {DevTools.map(tool => (
            <Card
              key={tool.id}
              className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${
                tool.available
                  ? 'border-primary/20 hover:border-primary cursor-pointer'
                  : 'opacity-70 border-gray-200'
              }`}
              onClick={() => tool.available && navigate(tool.path)}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-primary/10 rounded-lg">{tool.icon}</div>
                  {!tool.available && (
                    <span className="bg-gray-200 text-gray-600 text-xs font-medium px-2.5 py-0.5 rounded">
                      Coming Soon
                    </span>
                  )}
                </div>
                <CardTitle className="text-xl mt-4">{tool.title}</CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              <CardFooter className="pt-3">
                <Button
                  variant={tool.available ? 'default' : 'outline'}
                  className="w-full justify-between"
                  disabled={!tool.available}
                  onClick={e => {
                    e.stopPropagation();
                    if (tool.available) navigate(tool.path);
                  }}
                >
                  {tool.available ? 'Open Tool' : 'Coming Soon'}
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
