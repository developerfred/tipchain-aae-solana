'use client';

import { useState, useEffect } from 'react';
import { Bot, Zap, CheckCircle, ArrowRight } from 'lucide-react';

interface AgentActivity {
  id: string;
  agentName: string;
  action: string;
  creator: string;
  amount: number;
  timestamp: Date;
  status: 'pending' | 'processing' | 'completed';
}

export default function AgentDemo() {
  const [activities, setActivities] = useState<AgentActivity[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        simulateAgentActivity();
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isRunning]);

  const simulateAgentActivity = () => {
    const agents = ['DiscoveryBot', 'TipperAgent', 'CuratorAI', 'AnalystBot'];
    const creators = ['alice', 'bob', 'carol', 'dave', 'eve'];
    const actions = [
      'Discovered creator',
      'Analyzing content',
      'Sending tip',
      'Updated reputation',
    ];

    const newActivity: AgentActivity = {
      id: Math.random().toString(36).substr(2, 9),
      agentName: agents[Math.floor(Math.random() * agents.length)],
      action: actions[Math.floor(Math.random() * actions.length)],
      creator: creators[Math.floor(Math.random() * creators.length)],
      amount: parseFloat((Math.random() * 0.5 + 0.1).toFixed(3)),
      timestamp: new Date(),
      status: 'pending',
    };

    setActivities((prev) => [newActivity, ...prev.slice(0, 9)]);

    // Simulate status progression
    setTimeout(() => {
      setActivities((prev) =>
        prev.map((a) => (a.id === newActivity.id ? { ...a, status: 'processing' } : a))
      );
    }, 500);

    setTimeout(() => {
      setActivities((prev) =>
        prev.map((a) => (a.id === newActivity.id ? { ...a, status: 'completed' } : a))
      );
    }, 1500);
  };

  const startDemo = () => {
    setIsRunning(true);
    // Simulate initial activities
    for (let i = 0; i < 3; i++) {
      setTimeout(() => simulateAgentActivity(), i * 1000);
    }
  };

  const stopDemo = () => {
    setIsRunning(false);
  };

  return (
    <div>
      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-gray-400">
          {isRunning ? 'Agents are running...' : 'Start the demo to see agents in action'}
        </div>
        <button
          onClick={isRunning ? stopDemo : startDemo}
          className={`px-6 py-2 rounded-lg font-semibold transition-all ${
            isRunning
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-primary-600 hover:bg-primary-700 text-white'
          }`}
        >
          {isRunning ? 'Stop Demo' : 'Start Demo'}
        </button>
      </div>

      {/* Activity Feed */}
      <div className="space-y-3">
        {activities.length === 0 ? (
          <div className="text-center py-12 bg-gray-800/30 rounded-xl border border-gray-700">
            <Bot className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No agent activity yet</p>
            <p className="text-sm text-gray-500 mt-1">Click "Start Demo" to begin</p>
          </div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className={`bg-gray-800/50 rounded-lg p-4 border transition-all ${
                activity.status === 'completed'
                  ? 'border-green-500/30'
                  : activity.status === 'processing'
                  ? 'border-primary-500/30'
                  : 'border-gray-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  {/* Agent Icon */}
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      activity.status === 'completed'
                        ? 'bg-green-500/20'
                        : activity.status === 'processing'
                        ? 'bg-primary-500/20 animate-pulse'
                        : 'bg-gray-700'
                    }`}
                  >
                    {activity.status === 'completed' ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : activity.status === 'processing' ? (
                      <div className="w-5 h-5 border-2 border-primary-400/30 border-t-primary-400 rounded-full animate-spin" />
                    ) : (
                      <Bot className="w-5 h-5 text-gray-400" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-semibold">{activity.agentName}</span>
                      <ArrowRight className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-300">{activity.action}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-gray-400">
                        Creator: @{activity.creator}
                      </span>
                      {activity.action.includes('tip') && (
                        <>
                          <span className="text-gray-600">•</span>
                          <span className="text-sm text-primary-400 font-semibold">
                            {activity.amount} SOL
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {activity.status === 'completed' && (
                      <span className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full border border-green-500/30">
                        Completed
                      </span>
                    )}
                    {activity.status === 'processing' && (
                      <span className="text-xs bg-primary-500/20 text-primary-400 px-3 py-1 rounded-full border border-primary-500/30 animate-pulse">
                        Processing
                      </span>
                    )}
                    {activity.status === 'pending' && (
                      <span className="text-xs bg-gray-700 text-gray-400 px-3 py-1 rounded-full">
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stats Summary */}
      {activities.length > 0 && (
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
            <div className="text-2xl font-bold text-white">
              {activities.length}
            </div>
            <div className="text-sm text-gray-400">Total Actions</div>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
            <div className="text-2xl font-bold text-primary-400">
              {activities.filter((a) => a.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-400">Completed</div>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
            <div className="text-2xl font-bold text-purple-400">
              {activities
                .filter((a) => a.action.includes('tip'))
                .reduce((sum, a) => sum + a.amount, 0)
                .toFixed(3)}
            </div>
            <div className="text-sm text-gray-400">SOL Tipped</div>
          </div>
        </div>
      )}
    </div>
  );
}
