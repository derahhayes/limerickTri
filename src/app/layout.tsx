import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://hotw.eventickets.ie'),
  title: 'Hell of the West Triathlon - 40th Anniversary | Kilkee, Co. Clare',
  description: 'Join us for the 40th running of Hell of the West Triathlon in beautiful Kilkee, Co. Clare. Ireland\'s most challenging triathlon on the dramatic Atlantic coastline.',
  keywords: 'triathlon, Hell of the West, Kilkee, Clare, Ireland, swimming, cycling, running, Atlantic, 40th anniversary',
  authors: [{ name: 'Limerick Triathlon Club' }],
  openGraph: {
    title: 'Hell of the West Triathlon - 40th Anniversary',
    description: 'Experience Ireland\'s most challenging triathlon on the dramatic Atlantic coastline of Kilkee, Co. Clare',
    url: 'https://hotw.eventickets.ie',
    siteName: 'Hell of the West Triathlon',
    images: [
      {
        url: '/images/Killkee_bay.jpg',
        width: 1200,
        height: 630,
        alt: 'Kilkee Coastline - Hell of the West Triathlon',
      },
    ],
    locale: 'en_IE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hell of the West Triathlon - 40th Anniversary',
    description: 'Experience Ireland\'s most challenging triathlon on the dramatic Atlantic coastline of Kilkee, Co. Clare',
    images: ['/images/Killkee_bay.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}