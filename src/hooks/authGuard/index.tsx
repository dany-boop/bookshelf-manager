'use client';
import { RootState } from '@/store/store';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import { useSelector } from 'react-redux';

interface AuthGuardProps {
  children: ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const router = useRouter();

  // Redirect unauthenticated users to the login page
  if (typeof window !== 'undefined' && !isAuthenticated) {
    router.replace('/auth/login');
    return null;
  }

  return <>{children}</>;
};
