import React, { createContext, useContext, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useOutsideClick } from '@/hooks/useOutsideClick';

const DropdownContext = createContext({ closeMenu: () => {} });

export const useDropdown = () => useContext(DropdownContext);

interface DropdownMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'left' | 'right';
}

export const DropdownMenu = ({ trigger, children, align = 'left' }: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useOutsideClick<HTMLDivElement>(() => setIsOpen(false));

  const toggleMenu = () => setIsOpen(prev => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={toggleMenu}
        aria-expanded={isOpen}
        className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
      >
        {trigger}
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <DropdownContext.Provider value={{ closeMenu }}>
          <div
            className={cn(
              'absolute z-50 mt-2 w-56 rounded-md border bg-background shadow-lg',
              align === 'right' ? 'right-0' : 'left-0'
            )}
          >
            <ul className="p-1">{children}</ul>
          </div>
        </DropdownContext.Provider>
      )}
    </div>
  );
};
