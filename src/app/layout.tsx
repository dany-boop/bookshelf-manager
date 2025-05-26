import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import StoreProvider from '@/redux/storeProvider';
import { Toaster } from 'sonner';
import { ThemeProvider } from './theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import ServiceWorker from './sw';
import PWAInstallPrompt from '@/components/common/pwa-install-prompt';
import OfflineNotice from '@/components/common/offline-notice';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Bookshelf',
  description: 'BookShelf App by Dany',
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StoreProvider>
      <html lang="en">
        <head>
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#000000" />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            disableTransitionOnChange
          >
            <Toaster position="top-center" richColors />
            <TooltipProvider>{children}</TooltipProvider>
          </ThemeProvider>
          <PWAInstallPrompt />
          <OfflineNotice />
          <ServiceWorker />
        </body>
      </html>
    </StoreProvider>
  );
}
