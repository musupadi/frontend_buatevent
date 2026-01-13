import './globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BuatEvent - Blockchain Hotel Reservation System',
  description: 'Book your hotel meeting packages with blockchain technology. Transparent pricing, secure bookings, and immutable records powered by Hyperledger Fabric.',
  keywords: 'hotel reservation, blockchain, meeting packages, conference rooms, Hyperledger Fabric, Indonesia hotels',
  authors: [{ name: 'BuatEvent' }],
  openGraph: {
    title: 'Buatevent - Blockchain Hotel Reservation',
    description: 'Revolutionary hotel booking platform powered by blockchain technology',
    type: 'website',
    locale: 'id_ID',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BuatEvent - Blockchain Hotel Reservation',
    description: 'Book hotels with blockchain transparency',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
