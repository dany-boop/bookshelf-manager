'use client';

import OfflineContainer from '@/components/container/offline-container';
import { useOnlineStatus } from '@/hooks/useOnline';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function OfflineNotice() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  useEffect(() => {
    if (navigator.onLine) {
      toast.success('Back online! ✅');
    }
  }, [isOnline]);

  return (
    <div className="flex items-center justify-center min-h-screen text-center p-4">
      <span>You are currently offline.</span>
      <button
        onClick={() => location.reload()}
        className="bg-white text-red-600 px-3 py-1 rounded hover:bg-gray-100 transition"
      >
        Reload
      </button>
    </div>
  );
}
