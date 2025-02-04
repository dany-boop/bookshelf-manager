'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Props {
  className?: React.ReactNode;
}
export const ModeToggle: React.FC<Props> = ({ className, ...props }) => {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      size="icon"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className={cn(
        'backdrop-filter backdrop-blur-sm  border-none rounded-xl text-slate-900 dark:text-slate-100',
        className
      )}
    >
      {theme === 'light' ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
};
