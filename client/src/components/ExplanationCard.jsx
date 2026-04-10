import React, { useState } from 'react';
import CodeFixBlock from './CodeFixBlock';

const TABS = ['Explanation', 'Root Cause', 'Fix', 'Prevention'];

export default function ExplanationCard({ analysis, language, onShare }) {
  const [activeTab, setActiveTab] = useState('Explanation');

  if (!analysis) return null;

  const tabContent = {
    Explanation: analysis.explanation,
    'Root Cause': analysis.rootCause,
    Prevention: analysis.prevention,
  };

  return (
    <div className="bg-surface border border-line rounded-xl overflow-hidden">
      {/* Tab bar */}
      <div className="flex items-center border-b border-line px-6">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-4 mr-6 text-sm font-medium border-b-2 -mb-px transition-colors duration-150 ${
              activeTab === tab
                ? 'text-neutral-100 border-violet-600'
                : 'text-zinc-500 border-transparent hover:text-zinc-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6 tab-content" key={activeTab}>
        {activeTab === 'Fix' ? (
          <CodeFixBlock fix={analysis.fix} />
        ) : (
          <p className="text-zinc-300 text-sm leading-relaxed">
            {tabContent[activeTab] || 'No information available.'}
          </p>
        )}
      </div>

      {/* Bottom row */}
      {(analysis.docsLink || onShare) && (
        <div className="px-6 py-4 border-t border-line flex items-center justify-between">
          {analysis.docsLink ? (
            <a
              href={analysis.docsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
            >
              View Documentation →
            </a>
          ) : (
            <span />
          )}

          {onShare && (
            <button
              onClick={onShare}
              className="text-xs text-zinc-500 hover:text-zinc-300 border border-line hover:border-zinc-600 px-3.5 py-1.5 rounded-md transition-all duration-150"
            >
              Share with Community
            </button>
          )}
        </div>
      )}
    </div>
  );
}
