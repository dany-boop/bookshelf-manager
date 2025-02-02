'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';

interface Props {
  className?: React.ReactNode;
}
export const ModeToggle: React.FC<Props> = ({ className, ...props }) => {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      size="icon"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="bg-gray-100/50 dark:bg-gray-900/50 backdrop-filter backdrop-blur-sm border-none rounded-xl text-slate-900 dark:text-slate-100"
    >
      {theme === 'light' ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
};
