'use client';

import { useEffect } from 'react';
import { Workbox } from 'workbox-window';

export default function ServiceWorker() {
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      const wb = new Workbox('/sw.js');

      wb.register()
        .then((registration) => {
          console.log('Service Worker registration successful');
        })
        .catch((err) => {
          console.log('Service Worker registration failed: ', err);
        });
    }
  }, []);

  return null;
}
