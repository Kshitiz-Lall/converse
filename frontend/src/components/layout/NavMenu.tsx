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
// Import the centralized tool configurations
import { devTools, aiTools } from '@/routes/index';
// import { ModeToggle } from '../mode-toggle';

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
              {devTools.map(tool => (
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
          <NavigationMenuTrigger>AI Tools</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {aiTools.map(tool => (
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
