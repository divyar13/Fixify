import React, { useState, useEffect } from 'react';
import { getStats } from '../api';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import toast from 'react-hot-toast';

const PIE_COLORS = ['#7c3aed', '#8b5cf6', '#a78bfa', '#6d28d9', '#5b21b6', '#4c1d95'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-surface border border-line rounded-lg px-3 py-2 text-xs">
        <p className="text-neutral-100 font-medium">{payload[0].name}</p>
        <p className="text-zinc-400">{payload[0].value} errors</p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadStats(); }, []);

  const loadStats = async () => {
    try {
      const res = await getStats();
      setStats(res.data);
    } catch {
      toast.error('Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <div className="w-5 h-5 border-2 border-line border-t-violet-600 rounded-full spin" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-20 text-zinc-500 text-sm">Unable to load statistics.</div>
    );
  }

  const solvedRate = stats.total > 0 ? Math.round((stats.solved / stats.total) * 100) : 0;

  const statBoxes = [
    { label: 'Total Analyzed', value: stats.total, sub: 'all time' },
    { label: 'Solved', value: stats.solved, sub: `${solvedRate}% success rate` },
    { label: 'This Week', value: stats.thisWeek, sub: 'recent activity' },
    { label: 'Success Rate', value: `${solvedRate}%`, sub: 'solved vs analyzed' },
  ];

  const barData = stats.languageStats?.slice(0, 6).map((s) => ({
    name: s._id,
    errors: s.count,
  })) || [];

  return (
    <div className="space-y-6">
      {/* Stat boxes */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statBoxes.map(({ label, value, sub }) => (
          <div
            key={label}
            className="bg-surface border border-line border-l-2 border-l-violet-600 rounded-xl p-6"
          >
            <div className="text-3xl font-semibold text-neutral-100 tracking-tight">
              {value}
            </div>
            <div className="text-xs text-zinc-500 mt-1 font-medium">{label}</div>
            <div className="text-xs text-zinc-700 mt-0.5">{sub}</div>
          </div>
        ))}
      </div>

      {stats.languageStats?.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Pie chart */}
          <div className="bg-surface border border-line rounded-xl p-6">
            <p className="text-sm font-medium text-neutral-100 mb-1">Language Distribution</p>
            <p className="text-xs text-zinc-600 mb-6">Errors by language</p>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={stats.languageStats}
                  dataKey="count"
                  nameKey="_id"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                >
                  {stats.languageStats.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={6}
                  formatter={(v) => <span className="text-xs text-zinc-400">{v}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar chart */}
          <div className="bg-surface border border-line rounded-xl p-6">
            <p className="text-sm font-medium text-neutral-100 mb-1">Top Languages</p>
            <p className="text-xs text-zinc-600 mb-6">Errors per language</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData} barCategoryGap="40%">
                <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#71717a', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#71717a', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={28}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(124,58,237,0.05)' }} />
                <Bar dataKey="errors" fill="#7c3aed" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Language breakdown list */}
      {stats.languageStats?.length > 0 && (
        <div className="bg-surface border border-line rounded-xl p-6">
          <p className="text-sm font-medium text-neutral-100 mb-4">Breakdown</p>
          <div className="space-y-3">
            {stats.languageStats.map((stat, i) => (
              <div key={stat._id} className="flex items-center gap-3">
                <span className="text-xs text-zinc-600 w-4">{i + 1}</span>
                <span className="text-sm text-zinc-300 flex-1">{stat._id}</span>
                <div className="flex-1 max-w-[120px] bg-line rounded-full h-1">
                  <div
                    className="h-1 rounded-full bg-violet-600"
                    style={{ width: `${Math.round((stat.count / stats.total) * 100)}%` }}
                  />
                </div>
                <span className="text-xs text-zinc-500 w-16 text-right">{stat.count} errors</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
