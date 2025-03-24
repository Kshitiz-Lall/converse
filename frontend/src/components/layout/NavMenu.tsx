import * as React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

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
import { devTools, aiTools } from '@/routes/index';

export function NavMenu() {
  const location = useLocation();
  const navigate = useNavigate();

  // Check for auth_token in both localStorage and sessionStorage
  const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');

  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    // Clear the auth_token from both storages
    localStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_token');
    // Navigate to home after logout
    navigate('/');
  };

  return (
    <NavigationMenu className="justify-center">
      <NavigationMenuList>
        {token ? (
          <>
            <NavigationMenuItem>
              <Link to="/dashboard">
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle()}
                  active={location.pathname === '/dashboard'}
                >
                  Dashboard
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Profile</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  <ListItem title="Profile" href="/profile">
                    <div>View and edit your profile</div>
                  </ListItem>
                  <ListItem title="Logout" href="#" onClick={handleLogout}>
                    <div>Logout from your account</div>
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </>
        ) : (
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
        )}

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
