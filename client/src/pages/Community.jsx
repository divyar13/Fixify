import React from 'react';
import CommunityFeed from '../components/CommunityFeed';

export default function Community() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-neutral-100 tracking-tight">Community</h1>
        <p className="text-zinc-500 text-sm mt-1">
          Real errors from real developers — solved and shared.
        </p>
      </div>

      <CommunityFeed />
    </div>
  );
}
