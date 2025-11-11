'use client';

import { useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import Header from '@/components/Header';
import CreatorCard from '@/components/CreatorCard';
import TipChainSDK, { Creator } from '@tipchain/sdk';
import { Users, Search, TrendingUp, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function CreatorsPage() {
    const { connection } = useConnection();
    const { publicKey } = useWallet();
    const [creators, setCreators] = useState<Creator[]>([]);
    const [filteredCreators, setFilteredCreators] = useState<Creator[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'reputation' | 'tips' | 'volume'>('reputation');

    useEffect(() => {
        loadCreators();
    }, [connection]);

    useEffect(() => {
        filterAndSortCreators();
    }, [searchTerm, sortBy, creators]);

    const loadCreators = async () => {
        try {
            setLoading(true);
            const sdk = new TipChainSDK(connection);

            // Try to load all creators
            const allCreators = await sdk.getAllCreators(100);
            setCreators(allCreators);
            setFilteredCreators(allCreators);
        } catch (error) {
            console.error('Error loading creators:', error);
            // If platform not initialized, show empty state
            setCreators([]);
            setFilteredCreators([]);
        } finally {
            setLoading(false);
        }
    };

    const filterAndSortCreators = () => {
        let filtered = [...creators];

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(
                (creator) =>
                    creator.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    creator.basename.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Sort
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'reputation':
                    return b.reputationScore - a.reputationScore;
                case 'tips':
                    return b.tipCount - a.tipCount;
                case 'volume':
                    return b.totalTipsReceived.toNumber() - a.totalTipsReceived.toNumber();
                default:
                    return 0;
            }
        });

        setFilteredCreators(filtered);
    };

    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
            <Header />

            <div className="container mx-auto px-4 py-12">
                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">
                                Discover Creators
                            </h1>
                            <p className="text-gray-400 text-lg">
                                Support amazing creators with x402 micropayments
                            </p>
                        </div>
                        <Link
                            href="/register"
                            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
                        >
                            Become a Creator
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                            <div className="flex items-center space-x-3">
                                <div className="bg-primary-500/20 p-3 rounded-lg">
                                    <Users className="w-6 h-6 text-primary-400" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-white">{creators.length}</div>
                                    <div className="text-sm text-gray-400">Total Creators</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                            <div className="flex items-center space-x-3">
                                <div className="bg-purple-500/20 p-3 rounded-lg">
                                    <TrendingUp className="w-6 h-6 text-purple-400" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-white">
                                        {creators.reduce((sum, c) => sum + c.tipCount, 0)}
                                    </div>
                                    <div className="text-sm text-gray-400">Total Tips</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                            <div className="flex items-center space-x-3">
                                <div className="bg-green-500/20 p-3 rounded-lg">
                                    <TrendingUp className="w-6 h-6 text-green-400" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-white">
                                        {(creators.reduce((sum, c) => sum + c.totalTipsReceived.toNumber(), 0) / 1e9).toFixed(2)}
                                    </div>
                                    <div className="text-sm text-gray-400">Total Volume (SOL)</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search creators by name or @basename..."
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors"
                            />
                        </div>

                        {/* Sort */}
                        <div className="flex items-center space-x-2">
                            <Filter className="w-5 h-5 text-gray-400" />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors"
                            >
                                <option value="reputation">Top Reputation</option>
                                <option value="tips">Most Tips</option>
                                <option value="volume">Highest Volume</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Creators Grid */}
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
                ) : filteredCreators.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCreators.map((creator, index) => (
                            <CreatorCard key={index} creator={creator} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="bg-gray-800/30 rounded-xl border border-gray-700 p-12">
                            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            {searchTerm ? (
                                <>
                                    <p className="text-gray-400 text-lg mb-2">No creators found matching "{searchTerm}"</p>
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="text-primary-400 hover:text-primary-300 font-semibold"
                                    >
                                        Clear search
                                    </button>
                                </>
                            ) : (
                                <>
                                    <p className="text-gray-400 text-lg mb-6">
                                        No creators registered yet
                                    </p>
                                    <Link
                                        href="/register"
                                        className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
                                    >
                                        Be the First Creator
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}