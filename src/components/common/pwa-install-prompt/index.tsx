'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      console.log('beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    setDeferredPrompt(null);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-gray-100/60 dark:bg-gray-900/60 backdrop-filter backdrop-blur-sm shadow-lg rounded-xl z-50 p-8">
      <div className="flex gap-8">
        <Image src="/assets/icon.png" width={75} height={75} alt="book-icon" />
        <div className="">
          <p>Install Bookshelf Manager for better experience?</p>
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleInstall}
              className="px-4 py-2 bg-blue-500/30 text-white rounded"
            >
              <span className="text-blue-500">Install</span>
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
