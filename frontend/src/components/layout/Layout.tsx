import { cn } from '@/lib/utils';
import { LogOut, User } from 'lucide-react';
import * as React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { DropdownMenu, useDropdown } from '../custom/DropdownMenu';
import { AIIndicator } from '../ui/ai-loading';
import { useAI } from '@/context/AIProvider';

/* ──────────────────────────────── */
/* Reusable List Item for Nav Menus */
/* ──────────────────────────────── */
interface NavItemProps {
  title: string;
  to: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
  active?: boolean;
}

const NavItem = ({
  title,
  to,
  icon,
  disabled,
  children,
  className,
  active = false,
  ...props
}: NavItemProps & React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const { closeMenu } = useDropdown();

  const content = (
    <>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{title}</span>
      {children}
    </>
  );

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (props.onClick) props.onClick(e);
    closeMenu();
  };

  if (disabled || to === '#') {
    return (
      <li>
        <span
          className={cn(
            'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors opacity-50 cursor-not-allowed',
            className
          )}
        >
          {content}
        </span>
      </li>
    );
  }

  return (
    <li>
      <Link
        to={to}
        onClick={handleClick}
        className={cn(
          'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
          active
            ? 'bg-accent text-accent-foreground'
            : 'hover:bg-accent hover:text-accent-foreground',
          className
        )}
        {...props}
      >
        {content}
      </Link>
    </li>
  );
};

/* ────────────── */
/* Nav Menu Logic */
/* ────────────── */
function NavMenu() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_token');
    navigate('/');
  };

  return (
    <nav className="flex w-full justify-between items-center">
      {/* LEFT SIDE NAVIGATION */}
      <ul className="flex items-center space-x-1">
        {/* {!token && <NavItem title="Home" to="/" active={location.pathname === '/'} />}

        {toolCategories.map(category => (
          <DropdownMenu key={category.category} trigger={<span>{category.category}</span>}>
            {category.tools.map(tool => (
              <NavItem
                key={tool.id}
                title={tool.title}
                to={tool.available ? tool.path : '#'}
                icon={tool.icon}
                disabled={!tool.available}
              >
                {!tool.available && (
                  <span className="ml-auto text-xs text-muted-foreground">Coming Soon</span>
                )}
              </NavItem>
            ))}
          </DropdownMenu>
        ))} */}
      </ul>

      {/* RIGHT SIDE - AUTH/PROFILE SECTION */}
      {token && (
        <ul className="flex items-center space-x-1">
          {/* Profile Dropdown */}
          <DropdownMenu
            trigger={
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </div>
            }
            align="right"
          >
            <NavItem
              title="Profile"
              to="/profile"
              icon={<User className="h-4 w-4" />}
              active={location.pathname === '/profile'}
            />
            <NavItem
              title="Logout"
              to="#"
              icon={<LogOut className="h-4 w-4" />}
              onClick={handleLogout}
            />
          </DropdownMenu>
        </ul>
      )}
    </nav>
  );
}

/* ──────────────────── */
/* Layout with NavMenu  */
/* ──────────────────── */
export function Layout() {
  const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  const { isAnyOperationActive, getCurrentOperation } = useAI();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Global AI Activity Indicator */}
      <AIIndicator 
        isActive={isAnyOperationActive} 
        operation={getCurrentOperation()?.description || 'processing'}
      />
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="p-2 mx-2 flex h-16 items-center">
          <div className="mx-4 bg-neutral-900 rounded-[5px] hidden md:flex">
            <Link to={token ? '/dashboard' : '/'} className="mr-4 flex items-center space-x-2">
              <span className="ml-4 text-white hidden font-secondary text-2xl sm:inline-block">
                Devtoolkit;
              </span>
            </Link>
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
