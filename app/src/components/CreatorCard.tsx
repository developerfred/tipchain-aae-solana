'use client';

import { Creator } from '@tipchain/sdk';
import { TrendingUp, Flame, Award } from 'lucide-react';
import { useState } from 'react';
import TipModal from './TipModal';

interface CreatorCardProps {
  creator: Creator;
}

export default function CreatorCard({ creator }: CreatorCardProps) {
  const [showTipModal, setShowTipModal] = useState(false);

  const totalSOL = creator.totalTipsReceived.toNumber() / 1e9;

  return (
    <>
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-primary-500/50 transition-all group">
        {/* Avatar & Name */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative">
            {creator.avatarUrl ? (
              <img
                src={creator.avatarUrl}
                alt={creator.displayName}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary-500 to-purple-600 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {creator.displayName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            {creator.streak >= 5 && (
              <div className="absolute -bottom-1 -right-1 bg-orange-500 rounded-full p-1">
                <Flame className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white group-hover:text-primary-400 transition-colors">
              {creator.displayName}
            </h3>
            <p className="text-sm text-gray-400">@{creator.basename}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-xl font-bold text-primary-400">{creator.tipCount}</div>
            <div className="text-xs text-gray-400">Tips</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-purple-400">{totalSOL.toFixed(2)}</div>
            <div className="text-xs text-gray-400">SOL</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-orange-400 flex items-center justify-center">
              {creator.streak}
              {creator.streak >= 5 && <Flame className="w-4 h-4 ml-1" />}
            </div>
            <div className="text-xs text-gray-400">Streak</div>
          </div>
        </div>

        {/* Reputation */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-gray-400">Reputation</span>
            <span className="text-primary-400 font-semibold">{creator.reputationScore}/100</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary-500 to-purple-600 h-2 rounded-full transition-all"
              style={{ width: `${creator.reputationScore}%` }}
            ></div>
          </div>
        </div>

        {/* Actions */}
        <button
          onClick={() => setShowTipModal(true)}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg font-semibold transition-all transform hover:scale-105"
        >
          Send Tip
        </button>
      </div>

      {showTipModal && (
        <TipModal
          creator={creator}
          onClose={() => setShowTipModal(false)}
        />
      )}
    </>
  );
}
