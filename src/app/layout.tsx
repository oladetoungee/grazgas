import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ui/theme-provider';
import Header from '@/components/features/shared/header';
import Footer from '@/components/features/shared/footer';
import { ScrollToTop } from '@/components/ui/scroll-to-top';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GrazGas – Ethereum Gas Estimator & Fee Tracker',
  description:
    'Built at Grazac Academy, GrazGas is a real-time Ethereum gas fee estimator and multi-network tracker with educational insights and embeddable widgets.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />

          {children}

          <Footer />
          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
