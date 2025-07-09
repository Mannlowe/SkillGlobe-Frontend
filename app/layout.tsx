import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SkillGlobe - AI-Driven Talent Ecosystem',
  description: 'Connect, learn, and grow with SkillGlobe\'s AI-powered talent platform. Discover jobs, monetize services, and upskill with personalized learning.',
  manifest: '/manifest.json',
  themeColor: '#FF6B35',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SkillGlobe',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/Images/favicon/favicon.ico' },
     
      { url: '/Images/favicon/web-app-manifest-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/Images/favicon/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SkillGlobe" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
          {children}
        </div>
      </body>
    </html>
  );
}