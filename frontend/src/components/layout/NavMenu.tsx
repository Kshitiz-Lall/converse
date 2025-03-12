import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

import { cn } from '@/lib/utils';
import {
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
import { ModeToggle } from '../mode-toggle';

const tools = [
  {
    id: 'data-format-converter',
    title: 'Data Format Converter',
    description: 'Convert between JSON, YAML, and XML formats',
    icon: <FileJson className="h-4 w-4 mr-2" />,
    path: '/data-format',
    available: true,
  },
  {
    id: 'image-optimizer',
    title: 'Image Optimizer',
    description: 'Compress and resize images for the web',
    icon: <Image className="h-4 w-4 mr-2" />,
    path: '/image-optimizer',
    available: true,
  },
  {
    id: 'regex-playground',
    title: 'Regex Playground',
    description: 'Test and validate regular expressions',
    icon: <Regex className="h-4 w-4 mr-2" />,
    path: '/regex',
    available: false,
  },
  {
    id: 'code-formatter',
    title: 'Code Formatter',
    description: 'Format and beautify your code',
    icon: <FileCode2 className="h-4 w-4 mr-2" />,
    path: '/code-formatter',
    available: false,
  },
  {
    id: 'css-grid-generator',
    title: 'CSS Grid Generator',
    description: 'Generate CSS grid layouts visually',
    icon: <Grid3X3 className="h-4 w-4 mr-2" />,
    path: '/grid-generator',
    available: false,
  },
  {
    id: 'cron-builder',
    title: 'Cron Expression Builder',
    description: 'Build and validate cron expressions',
    icon: <Clock className="h-4 w-4 mr-2" />,
    path: '/cron-builder',
    available: false,
  },
];

const moreTools = [
  {
    id: 'markdown-editor',
    title: 'Markdown Editor',
    description: 'Write and preview markdown documents',
    icon: <FileText className="h-4 w-4 mr-2" />,
    path: '/markdown',
    available: false,
  },
  {
    id: 'api-tester',
    title: 'API Request Tester',
    description: 'Test API endpoints with different HTTP methods',
    icon: <RefreshCw className="h-4 w-4 mr-2" />,
    path: '/api-tester',
    available: false,
  },
  {
    id: 'file-diff',
    title: 'File Diff Tool',
    description: 'Compare files and see the differences',
    icon: <FileCog className="h-4 w-4 mr-2" />,
    path: '/file-diff',
    available: false,
  },
];

export function NavMenu() {
  const location = useLocation();

  return (
    <NavigationMenu className="justify-center">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link to="/">
            <NavigationMenuLink
              className={navigationMenuTriggerStyle()}
              active={location.pathname === '/'}
            >
              Home
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Developer Tools</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {tools.map(tool => (
                <ListItem
                  key={tool.id}
                  title={tool.title}
                  href={tool.available ? tool.path : '#'}
                  disabled={!tool.available}
                >
                  <div className="flex items-center">
                    {tool.icon}
                    <span>{tool.description}</span>
                  </div>
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>More Tools</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {moreTools.map(tool => (
                <ListItem
                  key={tool.id}
                  title={tool.title}
                  href={tool.available ? tool.path : '#'}
                  disabled={!tool.available}
                >
                  <div className="flex items-center">
                    {tool.icon}
                    <span>{tool.description}</span>
                  </div>
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* <NavigationMenuItem>
          <Link to="/login">
            <NavigationMenuLink
              className={navigationMenuTriggerStyle()}
              active={location.pathname === '/login'}
            >
              Login
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/login">
            <NavigationMenuLink>
              <ModeToggle />
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem> */}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

interface ListItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  title: string;
  href: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

const ListItem = React.forwardRef<HTMLAnchorElement, ListItemProps>(
  ({ className, title, children, href, disabled, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            href={href}
            onClick={e => disabled && e.preventDefault()}
            className={cn(
              'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
              {
                'opacity-50 cursor-not-allowed hover:bg-transparent': disabled,
              },
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">
              {title}
              {disabled && (
                <span className="ml-2 text-xs text-muted-foreground">(Coming Soon)</span>
              )}
            </div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  }
);
ListItem.displayName = 'ListItem';
