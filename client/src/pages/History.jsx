import React, { useState } from 'react';
import HistoryList from '../components/HistoryList';
import ExplanationCard from '../components/ExplanationCard';

export default function History() {
  const [selectedError, setSelectedError] = useState(null);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-neutral-100 tracking-tight">Error History</h1>
        <p className="text-zinc-500 text-sm mt-1">Browse and revisit your past debug sessions.</p>
      </div>

      <div className="flex gap-6 items-start">
        {/* Sidebar */}
        <div className="w-72 shrink-0">
          <HistoryList onSelectError={setSelectedError} selectedId={selectedError?._id} />
        </div>

        {/* Detail panel */}
        <div className="flex-1 min-w-0">
          {selectedError ? (
            <ExplanationCard analysis={selectedError} language={selectedError.language} />
          ) : (
            <div className="border border-dashed border-line rounded-xl py-24 text-center">
              <p className="text-zinc-600 text-sm">Select an error to view its analysis</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
