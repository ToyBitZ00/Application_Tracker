import { Fraunces, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import SegmentedNav from '@/components/SegmentedNav';

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

const themeScript = `
  (function () {
    try {
      var theme = localStorage.getItem('application_tracker_theme') || 'light';
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      var useDark = theme === 'dark' || (theme === 'system' && prefersDark);

      document.documentElement.classList.toggle('dark', useDark);
      document.documentElement.dataset.theme = theme;
    } catch (error) {}
  })();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: themeScript,
          }}
        />
      </head>

      <body className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable} font-body bg-paper text-ink`}>
        {children}
        <SegmentedNav />
      </body>
    </html>
  );
}
