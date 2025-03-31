import * as React from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';

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

/* ──────────────────────────────── */
/* Reusable List Item for Nav Menus */
/* ──────────────────────────────── */
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

/* ────────────── */
/* Nav Menu Logic */
/* ────────────── */
function NavMenu() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');

  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    localStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_token');
    navigate('/');
  };

  return (
    <NavigationMenu className="flex w-full justify-between items-center">
      {/* LEFT SIDE NAVIGATION */}
      <NavigationMenuList className="flex space-x-2">
        {!token && (
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

      {/* RIGHT SIDE - AUTH/PROFILE SECTION */}
      {token && (
        <NavigationMenuList className="flex space-x-2">
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
                  View and edit your profile
                </ListItem>
                <ListItem title="Admin" href="/admin-panel">
                  Admin panel access
                </ListItem>
                <ListItem title="Logout" href="#" onClick={handleLogout}>
                  Logout from your account
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      )}
    </NavigationMenu>
  );
}


/* ──────────────────── */
/* Layout with NavMenu  */
/* ──────────────────── */
export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mx-4 bg-neutral-900 rounded-[5px] hidden md:flex">
            <a className="mr-4 flex items-center space-x-2" href="/">
              <span className="ml-4 text-white hidden font-secondary text-2xl sm:inline-block">
                Devtoolkit;
              </span>
            </a>
          </div>
          <NavMenu />
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="py-6 md:px-8 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 DevToolkit. All tools are free to use.
          </p>
        </div>
      </footer>
    </div>
  );
}
