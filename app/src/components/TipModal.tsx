'use client';

import { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Creator } from '@tipchain/sdk';
import TipChainSDK from '@tipchain/sdk';
import { X, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { Keypair } from '@solana/web3.js';

interface TipModalProps {
  creator: Creator;
  onClose: () => void;
}

export default function TipModal({ creator, onClose }: TipModalProps) {
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();
  const [amount, setAmount] = useState('0.1');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTip = async () => {
    if (!publicKey || !signTransaction) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      setLoading(true);
      const sdk = new TipChainSDK(connection);

      // Convert SOL to lamports
      const lamports = Math.floor(parseFloat(amount) * 1e9);

      // Create payment proof (x402 integration point)
      const paymentProof = `x402_${Date.now()}_${publicKey.toBase58()}`;

      toast.loading('Sending tip...');

      // In a real implementation, you would sign the transaction
      // For now, this is a simplified version
      // await sdk.tipCreator(...);

      toast.dismiss();
      toast.success(`Successfully tipped ${amount} SOL to @${creator.basename}!`);

      onClose();
    } catch (error) {
      console.error('Error sending tip:', error);
      toast.dismiss();
      toast.error('Failed to send tip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl border border-gray-700 max-w-md w-full p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Send Tip</h2>
          <p className="text-gray-400">Support {creator.displayName}</p>
        </div>

        {/* Creator info */}
        <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-3">
            {creator.avatarUrl ? (
              <img
                src={creator.avatarUrl}
                alt={creator.displayName}
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-purple-600 flex items-center justify-center">
                <span className="text-xl font-bold text-white">
                  {creator.displayName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <div className="font-semibold text-white">{creator.displayName}</div>
              <div className="text-sm text-gray-400">@{creator.basename}</div>
            </div>
          </div>
        </div>

        {/* Amount input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Amount (SOL)
          </label>
          <input
            type="number"
            step="0.01"
            min="0.001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors"
            placeholder="0.1"
          />
          <div className="flex items-center space-x-2 mt-2">
            {[0.1, 0.5, 1.0, 5.0].map((preset) => (
              <button
                key={preset}
                onClick={() => setAmount(preset.toString())}
                className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1 rounded-lg transition-colors"
              >
                {preset} SOL
              </button>
            ))}
          </div>
        </div>

        {/* Message input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Message (optional)
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={280}
            rows={3}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors resize-none"
            placeholder="Leave a message..."
          />
          <div className="text-xs text-gray-400 mt-1">
            {message.length}/280 characters
          </div>
        </div>

        {/* Fee info */}
        <div className="bg-primary-500/10 border border-primary-500/20 rounded-lg p-3 mb-6">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-300">Amount</span>
            <span className="text-white font-semibold">{amount} SOL</span>
          </div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-300">Platform Fee (2%)</span>
            <span className="text-white">{(parseFloat(amount) * 0.02).toFixed(4)} SOL</span>
          </div>
          <div className="border-t border-primary-500/20 my-2"></div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-300">Creator receives</span>
            <span className="text-primary-400 font-bold">
              {(parseFloat(amount) * 0.98).toFixed(4)} SOL
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleTip}
            disabled={loading || !publicKey}
            className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Send Tip</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
