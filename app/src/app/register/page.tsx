'use client';

import { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import Header from '@/components/Header';
import TipChainSDK from '@tipchain/sdk';
import { UserPlus, Bot, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

type RegistrationType = 'creator' | 'agent';

export default function RegisterPage() {
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();
  const router = useRouter();

  const [type, setType] = useState<RegistrationType>('creator');
  const [loading, setLoading] = useState(false);

  // Creator fields
  const [basename, setBasename] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  // Agent fields
  const [agentName, setAgentName] = useState('');
  const [agentType, setAgentType] = useState('discovery');

  const handleRegisterCreator = async () => {
    if (!publicKey || !signTransaction) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!basename || !displayName) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (basename.length > 20) {
      toast.error('Basename must be 20 characters or less');
      return;
    }

    try {
      setLoading(true);
      toast.loading('Registering creator...');

      const sdk = new TipChainSDK(connection);

      // In production, this would actually call the contract
      // await sdk.registerCreator(...)

      // Simulate registration
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.dismiss();
      toast.success('Creator registered successfully!');

      setTimeout(() => {
        router.push('/');
      }, 1000);
    } catch (error) {
      console.error('Error registering creator:', error);
      toast.dismiss();
      toast.error('Failed to register creator');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterAgent = async () => {
    if (!publicKey || !signTransaction) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!agentName) {
      toast.error('Please enter an agent name');
      return;
    }

    try {
      setLoading(true);
      toast.loading('Registering AI agent...');

      const sdk = new TipChainSDK(connection);

      // In production, this would actually call the contract
      // await sdk.registerAgent(...)

      // Simulate registration
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.dismiss();
      toast.success('AI Agent registered successfully!');

      setTimeout(() => {
        router.push('/agents');
      }, 1000);
    } catch (error) {
      console.error('Error registering agent:', error);
      toast.dismiss();
      toast.error('Failed to register agent');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              Join TipChain
            </h1>
            <p className="text-gray-400 text-lg">
              Register as a creator or launch an AI agent
            </p>
          </div>

          {/* Type Selection */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              onClick={() => setType('creator')}
              className={`p-6 rounded-xl border-2 transition-all ${
                type === 'creator'
                  ? 'border-primary-500 bg-primary-500/10'
                  : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
              }`}
            >
              <UserPlus className={`w-8 h-8 mx-auto mb-3 ${
                type === 'creator' ? 'text-primary-400' : 'text-gray-400'
              }`} />
              <div className="font-semibold text-white mb-1">Creator</div>
              <div className="text-sm text-gray-400">
                Monetize your content
              </div>
            </button>

            <button
              onClick={() => setType('agent')}
              className={`p-6 rounded-xl border-2 transition-all ${
                type === 'agent'
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
              }`}
            >
              <Bot className={`w-8 h-8 mx-auto mb-3 ${
                type === 'agent' ? 'text-purple-400' : 'text-gray-400'
              }`} />
              <div className="font-semibold text-white mb-1">AI Agent</div>
              <div className="text-sm text-gray-400">
                Autonomous discovery
              </div>
            </button>
          </div>

          {/* Registration Form */}
          <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-8">
            {type === 'creator' ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Basename <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={basename}
                    onChange={(e) => setBasename(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                    maxLength={20}
                    placeholder="yourname"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors"
                  />
                  <div className="text-xs text-gray-400 mt-1">
                    {basename.length}/20 characters (lowercase, no spaces)
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Display Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    maxLength={50}
                    placeholder="Your Display Name"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Avatar URL (optional)
                  </label>
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>

                <button
                  onClick={handleRegisterCreator}
                  disabled={loading || !publicKey}
                  className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Registering...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      <span>Register as Creator</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Agent Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    maxLength={30}
                    placeholder="MyAgent"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Agent Type
                  </label>
                  <select
                    value={agentType}
                    onChange={(e) => setAgentType(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                  >
                    <option value="discovery">Discovery Agent</option>
                    <option value="curator">Curator Agent</option>
                    <option value="analyst">Analyst Agent</option>
                    <option value="tipper">Tipper Agent</option>
                  </select>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-400 mb-2">Agent Capabilities</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Autonomous creator discovery</li>
                    <li>• x402 payment integration</li>
                    <li>• Reputation tracking</li>
                    <li>• Content analysis</li>
                  </ul>
                </div>

                <button
                  onClick={handleRegisterAgent}
                  disabled={loading || !publicKey}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Registering...</span>
                    </>
                  ) : (
                    <>
                      <Bot className="w-5 h-5" />
                      <span>Register AI Agent</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {!publicKey && (
              <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className="text-yellow-400 text-sm text-center">
                  Please connect your wallet to register
                </p>
              </div>
            )}
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
              <h3 className="font-semibold text-white mb-3">For Creators</h3>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>✓ Receive tips via x402</li>
                <li>✓ Build on-chain reputation</li>
                <li>✓ Monetize APIs</li>
                <li>✓ Track analytics</li>
              </ul>
            </div>

            <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
              <h3 className="font-semibold text-white mb-3">For Agents</h3>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>✓ Autonomous operations</li>
                <li>✓ Embedded wallets</li>
                <li>✓ Smart discovery</li>
                <li>✓ Reputation system</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
