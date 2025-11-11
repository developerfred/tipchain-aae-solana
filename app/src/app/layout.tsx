import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { WalletContextProvider } from '@/lib/WalletProvider'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TipChain Agent Economy | Solana x402 Hackathon',
  description: 'AI Agent-powered creator economy with x402 micropayments on Solana',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletContextProvider>
          <Toaster position="bottom-right" />
          {children}
        </WalletContextProvider>
      </body>
    </html>
  )
}
