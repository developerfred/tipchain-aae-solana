'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Link from 'next/link';
import { Zap } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b border-gray-800 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-r from-primary-500 to-purple-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-400 to-purple-600 bg-clip-text text-transparent">
                TipChain
              </h1>
              <p className="text-xs text-gray-400">Agent Economy</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/creators"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Creators
            </Link>
            <Link
              href="/agents"
              className="text-gray-300 hover:text-white transition-colors"
            >
              AI Agents
            </Link>
            <Link
              href="/pitch"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Pitch
            </Link>
            <Link
              href="/register"
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-all font-semibold"
            >
              Register
            </Link>
          </nav>

          {/* Wallet Button */}
          <div className="flex items-center space-x-4">
            <WalletMultiButton />
          </div>
        </div>
      </div>
    </header>
  );
}