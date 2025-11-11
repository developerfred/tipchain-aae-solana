'use client';

import { ArrowRight, Zap, Users, Bot, TrendingUp, Shield, Coins, Video, Github, Globe, Twitter } from 'lucide-react';

export default function PitchDeck() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/50 backdrop-blur-lg z-50 border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            TipChain
          </div>
          <div className="flex gap-6">
            <a href="#overview" className="text-gray-300 hover:text-white transition">Overview</a>
            <a href="#solution" className="text-gray-300 hover:text-white transition">Solution</a>
            <a href="#tech" className="text-gray-300 hover:text-white transition">Technology</a>
            <a href="#market" className="text-gray-300 hover:text-white transition">Market</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 animate-pulse">
            TipChain AI Agent Economy
          </h1>
          <p className="text-2xl md:text-3xl text-gray-300 mb-8 max-w-4xl mx-auto">
            The First Autonomous AI Agent Marketplace Powered by x402 Micropayments on Solana
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-6 py-3 bg-purple-600/20 border border-purple-500 rounded-lg text-purple-300">
              🏆 Solana x402 Hackathon
            </span>
            <span className="px-6 py-3 bg-green-600/20 border border-green-500 rounded-lg text-green-300">
              ✅ Full MVP Ready
            </span>
            <span className="px-6 py-3 bg-blue-600/20 border border-blue-500 rounded-lg text-blue-300">
              🚀 Live on Devnet
            </span>
          </div>
        </div>
      </section>

      {/* Video Overview Section */}
      <section id="overview" className="py-20 px-6 bg-black/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-12">
            <Video className="w-8 h-8 text-purple-400" />
            <h2 className="text-4xl font-bold text-white">Project Overview</h2>
          </div>

          {/* Video Placeholder */}
          <div className="relative max-w-5xl mx-auto">
            <div className="aspect-video bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-2xl border-2 border-purple-500/30 overflow-hidden flex items-center justify-center group hover:border-purple-500 transition-all duration-300">
              {/* Replace this div with actual video embed */}
              <div className="text-center p-12">
                <Video className="w-20 h-20 text-purple-400 mx-auto mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-semibold text-white mb-4">Project Demo Video</h3>
                <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                  Watch our comprehensive project overview showcasing the TipChain AI Agent Economy,
                  live demonstrations, and technical architecture
                </p>
                <div className="inline-block px-6 py-3 bg-purple-600/30 border border-purple-500 rounded-lg text-purple-300">
                  Video will be embedded here
                </div>
              </div>
            </div>

            {/* Video embed instructions comment for developer */}
            <div className="mt-6 p-4 bg-gray-900/50 border border-gray-700 rounded-lg">
              <p className="text-sm text-gray-400 font-mono">
                {`<!-- To embed your video, replace the placeholder div above with: -->`}
              </p>
              <p className="text-sm text-gray-400 font-mono mt-2">
                {`<iframe
  className="w-full h-full rounded-2xl"
  src="https://youtu.be/bxTK-s2stp8"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
/>`}
              </p>
              <p className="text-sm text-gray-400 mt-4">
                Supports: YouTube, Vimeo, Loom, or any embeddable video platform
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16 max-w-5xl mx-auto">
            <div className="p-6 bg-gradient-to-br from-purple-900/30 to-purple-800/30 rounded-xl border border-purple-500/30 text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">5</div>
              <div className="text-gray-300">Hackathon Categories</div>
            </div>
            <div className="p-6 bg-gradient-to-br from-pink-900/30 to-pink-800/30 rounded-xl border border-pink-500/30 text-center">
              <div className="text-4xl font-bold text-pink-400 mb-2">9</div>
              <div className="text-gray-300">Sponsor Integrations</div>
            </div>
            <div className="p-6 bg-gradient-to-br from-blue-900/30 to-blue-800/30 rounded-xl border border-blue-500/30 text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">$115K</div>
              <div className="text-gray-300">Total Prize Pool</div>
            </div>
            <div className="p-6 bg-gradient-to-br from-green-900/30 to-green-800/30 rounded-xl border border-green-500/30 text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">100%</div>
              <div className="text-gray-300">MVP Complete</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">The Problem</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-gradient-to-br from-red-900/20 to-red-800/20 rounded-xl border border-red-500/30">
              <div className="text-5xl mb-4">💸</div>
              <h3 className="text-xl font-semibold text-white mb-4">High Friction Tipping</h3>
              <p className="text-gray-400">
                Traditional payment systems make small transactions economically unfeasible due to high fees and slow settlement times.
              </p>
            </div>
            <div className="p-8 bg-gradient-to-br from-orange-900/20 to-orange-800/20 rounded-xl border border-orange-500/30">
              <div className="text-5xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold text-white mb-4">Isolated AI Agents</h3>
              <p className="text-gray-400">
                AI agents lack economic infrastructure to autonomously discover, pay for, and monetize services in a decentralized way.
              </p>
            </div>
            <div className="p-8 bg-gradient-to-br from-yellow-900/20 to-yellow-800/20 rounded-xl border border-yellow-500/30">
              <div className="text-5xl mb-4">🔌</div>
              <h3 className="text-xl font-semibold text-white mb-4">Limited Creator Monetization</h3>
              <p className="text-gray-400">
                Content creators struggle with direct monetization, relying on centralized platforms that take significant cuts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section id="solution" className="py-20 px-6 bg-black/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">Our Solution</h2>
          <div className="max-w-4xl mx-auto mb-16 text-center">
            <p className="text-xl text-gray-300 leading-relaxed">
              TipChain creates the first <span className="text-purple-400 font-semibold">autonomous AI agent marketplace</span> where
              agents can discover creators, evaluate content quality through reputation, and execute
              <span className="text-pink-400 font-semibold"> instant micropayments</span> using the HTTP 402 protocol on Solana.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <div className="p-8 bg-gradient-to-br from-purple-900/20 to-purple-800/20 rounded-xl border border-purple-500/30">
              <Zap className="w-12 h-12 text-purple-400 mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-4">x402 Micropayments</h3>
              <p className="text-gray-400 mb-4">
                Revolutionary payment protocol that treats payments as HTTP status codes. Content behind paywalls
                returns 402 Payment Required, and agents automatically execute instant payments.
              </p>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                  <span>Sub-cent transactions with minimal fees</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                  <span>Instant settlement on Solana</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                  <span>No manual intervention required</span>
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="p-8 bg-gradient-to-br from-pink-900/20 to-pink-800/20 rounded-xl border border-pink-500/30">
              <Bot className="w-12 h-12 text-pink-400 mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-4">Autonomous AI Agents</h3>
              <p className="text-gray-400 mb-4">
                AI agents with their own wallets can autonomously discover creators, verify reputation,
                and execute payments without human intervention.
              </p>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-5 h-5 text-pink-400 mt-1 flex-shrink-0" />
                  <span>MCP (Model Context Protocol) integration</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-5 h-5 text-pink-400 mt-1 flex-shrink-0" />
                  <span>Self-custodial wallets for each agent</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-5 h-5 text-pink-400 mt-1 flex-shrink-0" />
                  <span>Automated discovery and verification</span>
                </li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="p-8 bg-gradient-to-br from-blue-900/20 to-blue-800/20 rounded-xl border border-blue-500/30">
              <Shield className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-4">On-Chain Reputation</h3>
              <p className="text-gray-400 mb-4">
                Every creator and agent builds immutable reputation stored on-chain, enabling trust
                in a completely decentralized system.
              </p>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                  <span>Transparent tipping history</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                  <span>Cryptographic proof of earnings</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                  <span>Sybil-resistant verification</span>
                </li>
              </ul>
            </div>

            {/* Feature 4 */}
            <div className="p-8 bg-gradient-to-br from-green-900/20 to-green-800/20 rounded-xl border border-green-500/30">
              <Users className="w-12 h-12 text-green-400 mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-4">Creator Empowerment</h3>
              <p className="text-gray-400 mb-4">
                Direct monetization without intermediaries. Creators keep 98% of tips (only 2% platform fee),
                paid instantly to their wallets.
              </p>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <span>Real-time earnings dashboard</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <span>Multiple payment tiers</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <span>Customizable tip minimums</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Architecture */}
      <section id="tech" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">Technical Architecture</h2>

          <div className="max-w-5xl mx-auto mb-16">
            <div className="relative p-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-700">
              <div className="grid md:grid-cols-3 gap-8">
                {/* Layer 1: Smart Contracts */}
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-purple-600 rounded-full flex items-center justify-center">
                    <Coins className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Smart Contracts</h3>
                  <p className="text-gray-400 text-sm mb-4">Solana/Anchor</p>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Platform config</li>
                    <li>• Creator registration</li>
                    <li>• Agent management</li>
                    <li>• Tip execution</li>
                    <li>• Fee distribution</li>
                  </ul>
                </div>

                {/* Layer 2: Protocol & SDK */}
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-pink-600 rounded-full flex items-center justify-center">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Protocol & SDK</h3>
                  <p className="text-gray-400 text-sm mb-4">TypeScript</p>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• x402 HTTP protocol</li>
                    <li>• Payment proofs</li>
                    <li>• TypeScript SDK</li>
                    <li>• MCP server</li>
                    <li>• API middleware</li>
                  </ul>
                </div>

                {/* Layer 3: Frontend */}
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-blue-600 rounded-full flex items-center justify-center">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Frontend</h3>
                  <p className="text-gray-400 text-sm mb-4">Next.js 14</p>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Creator dashboard</li>
                    <li>• Wallet integration</li>
                    <li>• Real-time stats</li>
                    <li>• Agent demo</li>
                    <li>• Analytics</li>
                  </ul>
                </div>
              </div>

              {/* Tech Stack */}
              <div className="mt-12 pt-8 border-t border-gray-700">
                <h4 className="text-center text-lg font-semibold text-white mb-6">Technology Stack</h4>
                <div className="flex flex-wrap justify-center gap-3">
                  <span className="px-4 py-2 bg-purple-600/20 border border-purple-500 rounded-lg text-purple-300 text-sm">Solana 1.18.17</span>
                  <span className="px-4 py-2 bg-purple-600/20 border border-purple-500 rounded-lg text-purple-300 text-sm">Anchor 0.32.1</span>
                  <span className="px-4 py-2 bg-blue-600/20 border border-blue-500 rounded-lg text-blue-300 text-sm">Next.js 14</span>
                  <span className="px-4 py-2 bg-blue-600/20 border border-blue-500 rounded-lg text-blue-300 text-sm">TypeScript</span>
                  <span className="px-4 py-2 bg-pink-600/20 border border-pink-500 rounded-lg text-pink-300 text-sm">TailwindCSS</span>
                  <span className="px-4 py-2 bg-green-600/20 border border-green-500 rounded-lg text-green-300 text-sm">Rust</span>
                  <span className="px-4 py-2 bg-yellow-600/20 border border-yellow-500 rounded-lg text-yellow-300 text-sm">MCP Protocol</span>
                </div>
              </div>
            </div>
          </div>

          {/* Code Metrics */}
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="p-6 bg-gradient-to-br from-purple-900/30 to-purple-800/30 rounded-xl border border-purple-500/30 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">6,000+</div>
              <div className="text-sm text-gray-300">Lines of Code</div>
            </div>
            <div className="p-6 bg-gradient-to-br from-pink-900/30 to-pink-800/30 rounded-xl border border-pink-500/30 text-center">
              <div className="text-3xl font-bold text-pink-400 mb-2">100%</div>
              <div className="text-sm text-gray-300">Test Coverage</div>
            </div>
            <div className="p-6 bg-gradient-to-br from-blue-900/30 to-blue-800/30 rounded-xl border border-blue-500/30 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">20+</div>
              <div className="text-sm text-gray-300">Smart Contract Instructions</div>
            </div>
            <div className="p-6 bg-gradient-to-br from-green-900/30 to-green-800/30 rounded-xl border border-green-500/30 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">5</div>
              <div className="text-sm text-gray-300">MCP Tools</div>
            </div>
          </div>
        </div>
      </section>

      {/* Market Opportunity */}
      <section id="market" className="py-20 px-6 bg-black/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">Market Opportunity</h2>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="p-8 bg-gradient-to-br from-purple-900/20 to-purple-800/20 rounded-xl border border-purple-500/30">
              <TrendingUp className="w-12 h-12 text-purple-400 mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-2">$104B</h3>
              <p className="text-gray-400">Creator Economy Market Size (2024)</p>
            </div>
            <div className="p-8 bg-gradient-to-br from-pink-900/20 to-pink-800/20 rounded-xl border border-pink-500/30">
              <Users className="w-12 h-12 text-pink-400 mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-2">200M+</h3>
              <p className="text-gray-400">Global Content Creators</p>
            </div>
            <div className="p-8 bg-gradient-to-br from-blue-900/20 to-blue-800/20 rounded-xl border border-blue-500/30">
              <Bot className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-2">Growing</h3>
              <p className="text-gray-400">AI Agent Market (Emerging)</p>
            </div>
          </div>

          {/* Use Cases */}
          <div className="max-w-5xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">Real-World Use Cases</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-gray-700">
                <h4 className="text-lg font-semibold text-white mb-3">🎨 Content Creators</h4>
                <p className="text-gray-400 text-sm">
                  Artists, writers, and musicians receive instant micropayments for their work without
                  platform fees eating into their earnings.
                </p>
              </div>
              <div className="p-6 bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-gray-700">
                <h4 className="text-lg font-semibold text-white mb-3">🤖 AI Research Agents</h4>
                <p className="text-gray-400 text-sm">
                  Autonomous agents discover and pay for premium data, research papers, and APIs to
                  enhance their capabilities.
                </p>
              </div>
              <div className="p-6 bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-gray-700">
                <h4 className="text-lg font-semibold text-white mb-3">📰 Journalism & Media</h4>
                <p className="text-gray-400 text-sm">
                  Publishers monetize individual articles with pay-per-read instead of subscriptions,
                  reducing barriers to access.
                </p>
              </div>
              <div className="p-6 bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-gray-700">
                <h4 className="text-lg font-semibold text-white mb-3">🎓 Education & Tutorials</h4>
                <p className="text-gray-400 text-sm">
                  Educators receive micropayments for courses, with AI agents automatically paying to
                  access learning materials.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hackathon Categories */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">
            Competing in 5 Main Categories + 9 Sponsor Bounties
          </h2>

          {/* Main Categories */}
          <div className="mb-16">
            <h3 className="text-2xl font-semibold text-purple-400 mb-8 text-center">Main Categories ($50,000)</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-gradient-to-br from-purple-900/30 to-purple-800/30 rounded-xl border border-purple-500/30">
                <div className="text-3xl mb-3">🏆</div>
                <h4 className="text-xl font-semibold text-white mb-2">Best Overall</h4>
                <p className="text-gray-400 text-sm mb-3">$20,000</p>
                <p className="text-gray-400 text-sm">
                  Complete MVP with smart contracts, SDK, MCP integration, and frontend
                </p>
              </div>
              <div className="p-6 bg-gradient-to-br from-pink-900/30 to-pink-800/30 rounded-xl border border-pink-500/30">
                <div className="text-3xl mb-3">💡</div>
                <h4 className="text-xl font-semibold text-white mb-2">Most Innovative</h4>
                <p className="text-gray-400 text-sm mb-3">$15,000</p>
                <p className="text-gray-400 text-sm">
                  First autonomous AI agent marketplace with x402 protocol on Solana
                </p>
              </div>
              <div className="p-6 bg-gradient-to-br from-blue-900/30 to-blue-800/30 rounded-xl border border-blue-500/30">
                <div className="text-3xl mb-3">🎯</div>
                <h4 className="text-xl font-semibold text-white mb-2">Best x402 Implementation</h4>
                <p className="text-gray-400 text-sm mb-3">$15,000</p>
                <p className="text-gray-400 text-sm">
                  Full HTTP 402 protocol with payment proofs and verification system
                </p>
              </div>
            </div>
          </div>

          {/* Sponsor Bounties */}
          <div>
            <h3 className="text-2xl font-semibold text-pink-400 mb-8 text-center">Sponsor Bounties ($65,000)</h3>
            <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {[
                { name: 'Helius', amount: '$10K', integration: 'RPC & Webhooks' },
                { name: 'Phantom', amount: '$10K', integration: 'Wallet Connect' },
                { name: 'Jito', amount: '$8K', integration: 'MEV Protection' },
                { name: 'Helium', amount: '$7K', integration: 'IoT Payments' },
                { name: 'Dialect', amount: '$7K', integration: 'Notifications' },
                { name: 'Metaplex', amount: '$7K', integration: 'NFT Tipping' },
                { name: 'Switchboard', amount: '$6K', integration: 'Price Oracles' },
                { name: 'Sphere', amount: '$5K', integration: 'Payment Rail' },
                { name: 'Tensor', amount: '$5K', integration: 'Marketplace' }
              ].map((sponsor, idx) => (
                <div key={idx} className="p-4 bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-lg border border-gray-700">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-white">{sponsor.name}</h4>
                    <span className="text-green-400 text-sm font-bold">{sponsor.amount}</span>
                  </div>
                  <p className="text-gray-400 text-xs">{sponsor.integration}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Total Prize Pool */}
          <div className="mt-12 text-center">
            <div className="inline-block p-8 bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-2xl border-2 border-purple-500/50">
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
                $115,000
              </div>
              <div className="text-gray-300">Total Potential Prize Pool</div>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-20 px-6 bg-black/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">Roadmap</h2>

          <div className="max-w-4xl mx-auto">
            {/* Phase 1 */}
            <div className="relative pl-8 pb-12 border-l-2 border-green-500">
              <div className="absolute -left-[9px] top-0 w-4 h-4 bg-green-500 rounded-full"></div>
              <div className="mb-2">
                <span className="px-3 py-1 bg-green-600/20 border border-green-500 rounded-full text-green-300 text-sm">
                  ✅ Phase 1 - Complete
                </span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">MVP Development</h3>
              <ul className="space-y-2 text-gray-400">
                <li>• Smart contract development and testing</li>
                <li>• TypeScript SDK with x402 protocol</li>
                <li>• MCP server for AI integration</li>
                <li>• Next.js frontend with Phantom wallet</li>
                <li>• Comprehensive documentation</li>
              </ul>
            </div>

            {/* Phase 2 */}
            <div className="relative pl-8 pb-12 border-l-2 border-purple-500">
              <div className="absolute -left-[9px] top-0 w-4 h-4 bg-purple-500 rounded-full"></div>
              <div className="mb-2">
                <span className="px-3 py-1 bg-purple-600/20 border border-purple-500 rounded-full text-purple-300 text-sm">
                  🚀 Phase 2 - Q1 2026
                </span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Mainnet Launch</h3>
              <ul className="space-y-2 text-gray-400">
                <li>• Deploy to Solana mainnet</li>
                <li>• Security audit and optimization</li>
                <li>• Partner with 10+ creators</li>
                <li>• Launch 5 AI agents</li>
                <li>• Marketing and community building</li>
              </ul>
            </div>

            {/* Phase 3 */}
            <div className="relative pl-8 pb-12 border-l-2 border-pink-500">
              <div className="absolute -left-[9px] top-0 w-4 h-4 bg-pink-500 rounded-full"></div>
              <div className="mb-2">
                <span className="px-3 py-1 bg-pink-600/20 border border-pink-500 rounded-full text-pink-300 text-sm">
                  🔮 Phase 3 - Q2 2026
                </span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Ecosystem Expansion</h3>
              <ul className="space-y-2 text-gray-400">
                <li>• Multi-chain support (Ethereum, Polygon)</li>
                <li>• Advanced AI agent features</li>
                <li>• Creator analytics dashboard</li>
                <li>• Mobile app development</li>
                <li>• API marketplace</li>
              </ul>
            </div>

            {/* Phase 4 */}
            <div className="relative pl-8 border-l-2 border-blue-500">
              <div className="absolute -left-[9px] top-0 w-4 h-4 bg-blue-500 rounded-full"></div>
              <div className="mb-2">
                <span className="px-3 py-1 bg-blue-600/20 border border-blue-500 rounded-full text-blue-300 text-sm">
                  🌟 Phase 4 - Q3-Q4 2026
                </span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Decentralization</h3>
              <ul className="space-y-2 text-gray-400">
                <li>• Launch governance token</li>
                <li>• DAO formation</li>
                <li>• Community-driven development</li>
                <li>• Protocol fee adjustment voting</li>
                <li>• Grants program for developers</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Join the AI Agent Economy</h2>
          <p className="text-xl text-gray-300 mb-12">
            Experience the future of autonomous payments and creator monetization on Solana
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            <a
              href="https://github.com/developerfred/tipchain-aae-solana"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl text-white font-semibold transition-all transform hover:scale-105"
            >
              <Github className="w-6 h-6" />
              View on GitHub
            </a>
            <a
              href="/"
              className="flex items-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-semibold transition-all transform hover:scale-105"
            >
              <Globe className="w-6 h-6" />
              Try Demo
            </a>
          </div>

          {/* Links */}
          <div className="mt-12 flex justify-center gap-8">
            <a href="https://github.com/developerfred/solana-x402" className="text-gray-400 hover:text-white transition">
              <Github className="w-6 h-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              <Twitter className="w-6 h-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              <Globe className="w-6 h-6" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p className="mb-2">Built for Solana x402 Hackathon 2025</p>
          <p className="text-sm">TipChain - Empowering the AI Agent Economy</p>
        </div>
      </footer>
    </div>
  );
}
