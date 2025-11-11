'use client';

import { useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import Header from '@/components/Header';
import StatsCard from '@/components/StatsCard';
import CreatorCard from '@/components/CreatorCard';
import AgentDemo from '@/components/AgentDemo';
import TipChainSDK, { Creator } from '@tipchain/sdk';
import { Users, TrendingUp, Zap, Trophy } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Home() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [stats, setStats] = useState({
    totalCreators: 0,
    totalTips: 0,
    totalVolume: 0,
    topTipAmount: 0,
  });
  const [topCreators, setTopCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlatformData();
  }, [connection]);

  const loadPlatformData = async () => {
    try {
      setLoading(true);
      const sdk = new TipChainSDK(connection);

      // Load platform stats
      const platformStats = await sdk.getPlatformStats();
      setStats(platformStats);

      // Load top creators
      const creators = await sdk.getAllCreators(6);
      setTopCreators(creators);
    } catch (error) {
      console.error('Error loading platform data:', error);
      toast.error('Failed to load platform data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-block mb-4">
            <span className="bg-primary-500/10 text-primary-400 px-4 py-2 rounded-full text-sm font-semibold border border-primary-500/20">
              🏆 Solana x402 Hackathon Project
            </span>
          </div>
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white via-primary-400 to-purple-600 bg-clip-text text-transparent">
            The AI Agent Economy
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Where AI agents autonomously discover, tip, and support creators using x402 micropayments on Solana
          </p>
          <div className="flex items-center justify-center space-x-4">
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105">
              Launch Agent
            </button>
            <button className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition-all">
              Become a Creator
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Creators"
            value={stats.totalCreators}
            icon={<Users className="w-6 h-6" />}
            trend="+12%"
            loading={loading}
          />
          <StatsCard
            title="Total Tips"
            value={stats.totalTips}
            icon={<Zap className="w-6 h-6" />}
            trend="+28%"
            loading={loading}
          />
          <StatsCard
            title="Volume (SOL)"
            value={(stats.totalVolume / 1e9).toFixed(2)}
            icon={<TrendingUp className="w-6 h-6" />}
            trend="+45%"
            loading={loading}
          />
          <StatsCard
            title="Top Tip (SOL)"
            value={(stats.topTipAmount / 1e9).toFixed(4)}
            icon={<Trophy className="w-6 h-6" />}
            trend="Record"
            loading={loading}
          />
        </div>
      </section>

      {/* Top Creators */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Top Creators</h2>
            <p className="text-gray-400">Discover and support amazing creators</p>
          </div>
          <button className="text-primary-400 hover:text-primary-300 font-semibold">
            View All →
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-800/50 rounded-xl p-6 animate-pulse">
                <div className="w-16 h-16 bg-gray-700 rounded-full mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : topCreators.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topCreators.map((creator, index) => (
              <CreatorCard key={index} creator={creator} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-800/30 rounded-xl border border-gray-700">
            <p className="text-gray-400 mb-4">No creators registered yet</p>
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-semibold transition-all">
              Be the First Creator
            </button>
          </div>
        )}
      </section>

      {/* AI Agent Demo */}
      <section className="container mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-primary-900/20 to-purple-900/20 rounded-2xl border border-primary-500/20 p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">AI Agent Demo</h2>
              <p className="text-gray-400">Watch autonomous agents discover and tip creators in real-time</p>
            </div>
            <div className="bg-green-500/20 text-green-400 px-4 py-2 rounded-lg border border-green-500/30">
              <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              Live
            </div>
          </div>
          <AgentDemo />
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Why TipChain?</h2>
          <p className="text-gray-400 text-lg">The future of creator monetization with AI agents</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-800/30 rounded-xl p-6 border border-gray-700 hover:border-primary-500/50 transition-all"
            >
              <div className="bg-primary-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-black/50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-400">
            <p>Built for Solana x402 Hackathon 2025</p>
            <p className="text-sm mt-2">
              Powered by Solana, x402, Anchor, and AI Agents
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

const features = [
  {
    icon: <Zap className="w-6 h-6 text-primary-400" />,
    title: 'x402 Micropayments',
    description: 'Instant, low-cost payments powered by x402 protocol on Solana',
  },
  {
    icon: <Users className="w-6 h-6 text-primary-400" />,
    title: 'AI Agent Discovery',
    description: 'Autonomous agents discover and support creators based on preferences',
  },
  {
    icon: <Trophy className="w-6 h-6 text-primary-400" />,
    title: 'Reputation System',
    description: 'On-chain reputation tracking for creators and agents',
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-primary-400" />,
    title: 'Streak Rewards',
    description: 'Creators earn reputation through consistent engagement',
  },
  {
    icon: <Zap className="w-6 h-6 text-primary-400" />,
    title: 'Real-time Analytics',
    description: 'Track tips, earnings, and agent activity in real-time',
  },
  {
    icon: <Users className="w-6 h-6 text-primary-400" />,
    title: 'Creator APIs',
    description: 'Monetize your content through x402-enabled APIs',
  },
];
