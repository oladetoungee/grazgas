'use client';
import React, { ReactNode } from 'react';
import Header from '../features/shared/header';
import Footer from '../features/shared/footer';
import { usePathname } from 'next/navigation';

const AppLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  if (pathname === '/widget') {
    return <>{children}</>;
  }
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default AppLayout;
