import { Fraunces, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import SegmentedNav from '@/components/SegmentedNav';
import PageTransition from '@/components/PageTransition';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '600', '700'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['500', '600'],
});

export const metadata = {
  title: 'Application Tracker',
  description: 'OJT / Internship application pipeline',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable} font-body bg-paper text-ink`}>
        <PageTransition>
          {children}
        </PageTransition>
        <SegmentedNav />
      </body>
    </html>
  );
}