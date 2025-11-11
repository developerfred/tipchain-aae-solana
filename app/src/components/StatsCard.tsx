'use client';

import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  trend?: string;
  loading?: boolean;
}

export default function StatsCard({ title, value, icon, trend, loading }: StatsCardProps) {
  if (loading) {
    return (
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-gray-700 rounded-lg"></div>
          <div className="w-16 h-6 bg-gray-700 rounded"></div>
        </div>
        <div className="h-8 bg-gray-700 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-primary-500/50 transition-all group">
      <div className="flex items-center justify-between mb-4">
        <div className="bg-primary-500/10 p-3 rounded-lg group-hover:bg-primary-500/20 transition-colors">
          <div className="text-primary-400">{icon}</div>
        </div>
        {trend && (
          <span className="text-green-400 text-sm font-semibold">
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-3xl font-bold text-white mb-1">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </h3>
      <p className="text-gray-400 text-sm">{title}</p>
    </div>
  );
}
