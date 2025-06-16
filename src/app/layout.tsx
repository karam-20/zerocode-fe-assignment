// /src/app/layout.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import './globals.css';
import Navbar from './components/Navbar';
import { usePathname } from 'next/navigation'



export default function RootLayout({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const pathname = usePathname()

  const hideNavbar = ['/login', '/register'].includes(pathname)


  return (
    <html lang="en">
      <body>
        {!hideNavbar && <div className='fixed top-0 left-0 w-full'>
          <Navbar />
        </div>}

        <QueryClientProvider client={queryClient}>
          <div className={hideNavbar ? '' : 'pt-16'}>
            {children}
          </div>
        </QueryClientProvider>
      </body>
    </html>
  );
}
