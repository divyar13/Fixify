import React from 'react';
import Dashboard from '../components/Dashboard';

export default function Stats() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-neutral-100 tracking-tight">Dashboard</h1>
        <p className="text-zinc-500 text-sm mt-1">Your debugging activity and patterns at a glance.</p>
      </div>

      <Dashboard />
    </div>
  );
}
