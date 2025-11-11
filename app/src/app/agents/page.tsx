'use client';

import { useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import Header from '@/components/Header';
import { Bot, Zap, TrendingUp, Activity, Plus, Search } from 'lucide-react';
import Link from 'next/link';

interface Agent {
    name: string;
    type: string;
    status: 'active' | 'idle' | 'offline';
    totalTips: number;
    volume: number;
    reputation: number;
    creatorsDiscovered: number;
}

export default function AgentsPage() {
    const { connection } = useConnection();
    const { publicKey } = useWallet();
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadAgents();
    }, [connection]);

    const loadAgents = async () => {
        try {
            setLoading(true);

            // Mock data for demo
            // In production, this would fetch from the blockchain
            const mockAgents: Agent[] = [
                {
                    name: 'DiscoveryBot',
                    type: 'discovery',
                    status: 'active',
                    totalTips: 156,
                    volume: 12.4,
                    reputation: 92,
                    creatorsDiscovered: 45,
                },
                {
                    name: 'TipperAgent',
                    type: 'tipper',
                    status: 'active',
                    totalTips: 203,
                    volume: 18.7,
                    reputation: 88,
                    creatorsDiscovered: 32,
                },
                {
                    name: 'CuratorAI',
                    type: 'curator',
                    status: 'idle',
                    totalTips: 89,
                    volume: 7.3,
                    reputation: 85,
                    creatorsDiscovered: 28,
                },
            ];

            setAgents(mockAgents);
        } catch (error) {
            console.error('Error loading agents:', error);
            setAgents([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredAgents = agents.filter((agent) =>
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
            <Header />

            <div className="container mx-auto px-4 py-12">
                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">
                                AI Agents
                            </h1>
                            <p className="text-gray-400 text-lg">
                                Autonomous agents discovering and supporting creators
                            </p>
                        </div>
                        <Link
                            href="/register?type=agent"
                            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center space-x-2"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Launch Agent</span>
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 rounded-xl p-6 border border-purple-500/30">
                            <div className="flex items-center space-x-3">
                                <div className="bg-purple-500/20 p-3 rounded-lg">
                                    <Bot className="w-6 h-6 text-purple-400" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-white">{agents.length}</div>
                                    <div className="text-sm text-gray-400">Active Agents</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-primary-900/30 to-primary-800/30 rounded-xl p-6 border border-primary-500/30">
                            <div className="flex items-center space-x-3">
                                <div className="bg-primary-500/20 p-3 rounded-lg">
                                    <Zap className="w-6 h-6 text-primary-400" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-white">
                                        {agents.reduce((sum, a) => sum + a.totalTips, 0)}
                                    </div>
                                    <div className="text-sm text-gray-400">Total Tips</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-green-900/30 to-green-800/30 rounded-xl p-6 border border-green-500/30">
                            <div className="flex items-center space-x-3">
                                <div className="bg-green-500/20 p-3 rounded-lg">
                                    <TrendingUp className="w-6 h-6 text-green-400" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-white">
                                        {agents.reduce((sum, a) => sum + a.volume, 0).toFixed(1)}
                                    </div>
                                    <div className="text-sm text-gray-400">Volume (SOL)</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-orange-900/30 to-orange-800/30 rounded-xl p-6 border border-orange-500/30">
                            <div className="flex items-center space-x-3">
                                <div className="bg-orange-500/20 p-3 rounded-lg">
                                    <Activity className="w-6 h-6 text-orange-400" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-white">
                                        {agents.filter(a => a.status === 'active').length}
                                    </div>
                                    <div className="text-sm text-gray-400">Currently Active</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="mb-8">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search agents by name or type..."
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                        />
                    </div>
                </div>

                {/* Agents Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-gray-800/50 rounded-xl p-6 animate-pulse">
                                <div className="w-16 h-16 bg-gray-700 rounded-full mb-4"></div>
                                <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : filteredAgents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredAgents.map((agent, index) => (
                            <div
                                key={index}
                                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all group"
                            >
                                {/* Agent Header */}
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="relative">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                                            <Bot className="w-8 h-8 text-white" />
                                        </div>
                                        <div
                                            className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-900 ${agent.status === 'active'
                                                    ? 'bg-green-500'
                                                    : agent.status === 'idle'
                                                        ? 'bg-yellow-500'
                                                        : 'bg-gray-500'
                                                }`}
                                        ></div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">
                                            {agent.name}
                                        </h3>
                                        <p className="text-sm text-gray-400 capitalize">{agent.type} Agent</p>
                                    </div>
                                </div>

                                {/* Status Badge */}
                                <div className="mb-4">
                                    <span
                                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${agent.status === 'active'
                                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                                : agent.status === 'idle'
                                                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                                    : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                                            }`}
                                    >
                                        {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                                    </span>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <div className="text-xl font-bold text-purple-400">{agent.totalTips}</div>
                                        <div className="text-xs text-gray-400">Tips Sent</div>
                                    </div>
                                    <div>
                                        <div className="text-xl font-bold text-pink-400">{agent.volume} SOL</div>
                                        <div className="text-xs text-gray-400">Volume</div>
                                    </div>
                                    <div>
                                        <div className="text-xl font-bold text-green-400">{agent.creatorsDiscovered}</div>
                                        <div className="text-xs text-gray-400">Creators</div>
                                    </div>
                                    <div>
                                        <div className="text-xl font-bold text-orange-400">{agent.reputation}</div>
                                        <div className="text-xs text-gray-400">Reputation</div>
                                    </div>
                                </div>

                                {/* Reputation Bar */}
                                <div className="mb-4">
                                    <div className="flex items-center justify-between text-xs mb-1">
                                        <span className="text-gray-400">Reputation</span>
                                        <span className="text-purple-400 font-semibold">{agent.reputation}/100</span>
                                    </div>
                                    <div className="w-full bg-gray-700 rounded-full h-2">
                                        <div
                                            className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full transition-all"
                                            style={{ width: `${agent.reputation}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Action Button */}
                                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold transition-all transform hover:scale-105">
                                    View Details
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="bg-gray-800/30 rounded-xl border border-gray-700 p-12">
                            <Bot className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            {searchTerm ? (
                                <>
                                    <p className="text-gray-400 text-lg mb-2">No agents found matching "{searchTerm}"</p>
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="text-purple-400 hover:text-purple-300 font-semibold"
                                    >
                                        Clear search
                                    </button>
                                </>
                            ) : (
                                <>
                                    <p className="text-gray-400 text-lg mb-6">
                                        No agents launched yet
                                    </p>
                                    <Link
                                        href="/register?type=agent"
                                        className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
                                    >
                                        Launch First Agent
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* Info Section */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 rounded-xl border border-purple-500/30 p-8">
                        <h3 className="text-2xl font-bold text-white mb-4">What are AI Agents?</h3>
                        <p className="text-gray-400 mb-4">
                            AI Agents are autonomous programs that discover creators, evaluate content quality,
                            and execute micropayments using the x402 protocol on Solana.
                        </p>
                        <ul className="space-y-2 text-gray-400">
                            <li>• Autonomous creator discovery</li>
                            <li>• Reputation-based decision making</li>
                            <li>• Instant x402 micropayments</li>
                            <li>• Self-custodial wallets</li>
                            <li>• MCP Protocol integration</li>
                        </ul>
                    </div>

                    <div className="bg-gradient-to-br from-primary-900/20 to-primary-800/20 rounded-xl border border-primary-500/30 p-8">
                        <h3 className="text-2xl font-bold text-white mb-4">Launch Your Agent</h3>
                        <p className="text-gray-400 mb-4">
                            Create your own AI agent to participate in the TipChain economy. Choose from
                            different agent types based on your needs.
                        </p>
                        <ul className="space-y-2 text-gray-400 mb-6">
                            <li>• <strong>Discovery Agents:</strong> Find new creators</li>
                            <li>• <strong>Curator Agents:</strong> Evaluate content quality</li>
                            <li>• <strong>Tipper Agents:</strong> Automated tipping</li>
                            <li>• <strong>Analyst Agents:</strong> Track trends</li>
                        </ul>
                        <Link
                            href="/register?type=agent"
                            className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                        >
                            Get Started →
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}