import React, { useState, useEffect } from 'react';
import { getCommunityFeed, upvoteError, getLanguages } from '../api';
import toast from 'react-hot-toast';

const LANG_COLORS = {
  JavaScript: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  TypeScript: 'bg-blue-400/10 text-blue-400 border-blue-400/20',
  Python:     'bg-blue-500/10 text-blue-500 border-blue-500/20',
  Java:       'bg-orange-500/10 text-orange-400 border-orange-500/20',
  'C++':      'bg-sky-500/10 text-sky-400 border-sky-500/20',
  'C#':       'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Go:         'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  Rust:       'bg-orange-600/10 text-orange-400 border-orange-600/20',
  Ruby:       'bg-red-500/10 text-red-400 border-red-500/20',
};
const langColor = (lang) => LANG_COLORS[lang] || 'bg-zinc-700/20 text-zinc-400 border-zinc-700/30';

export default function CommunityFeed() {
  const [errors, setErrors] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => { loadLanguages(); }, []);
  useEffect(() => { loadFeed(); }, [language, sortBy, page]);

  const loadLanguages = async () => {
    try {
      const res = await getLanguages();
      setLanguages(res.data || []);
    } catch { /* silent */ }
  };

  const loadFeed = async () => {
    try {
      setLoading(true);
      const res = await getCommunityFeed(language || undefined, page, 12, sortBy);
      setErrors(res.data.errors || []);
      setTotal(res.data.total || 0);
    } catch {
      toast.error('Failed to load feed');
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (e, id) => {
    e.stopPropagation();
    try {
      await upvoteError(id);
      loadFeed();
    } catch {
      toast.error('Failed to upvote');
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Language pills */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { setLanguage(''); setPage(1); }}
            className={`text-xs px-3 py-1.5 rounded-md border transition-all duration-150 ${
              language === ''
                ? 'bg-violet-600/10 text-violet-400 border-violet-600/40'
                : 'text-zinc-500 border-line hover:border-zinc-600 hover:text-zinc-300'
            }`}
          >
            All
          </button>
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => { setLanguage(lang); setPage(1); }}
              className={`text-xs px-3 py-1.5 rounded-md border transition-all duration-150 ${
                language === lang
                  ? 'bg-violet-600/10 text-violet-400 border-violet-600/40'
                  : 'text-zinc-500 border-line hover:border-zinc-600 hover:text-zinc-300'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>

        {/* Sort toggle */}
        <div className="ml-auto flex items-center gap-1 bg-surface border border-line rounded-lg p-1">
          {['newest', 'popular'].map((s) => (
            <button
              key={s}
              onClick={() => { setSortBy(s); setPage(1); }}
              className={`text-xs px-3 py-1 rounded-md transition-all duration-150 ${
                sortBy === s
                  ? 'bg-violet-600 text-white'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {s === 'newest' ? 'Recent' : 'Top'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-5 h-5 border-2 border-line border-t-violet-600 rounded-full spin" />
        </div>
      ) : errors.length ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {errors.map((error) => (
              <div
                key={error._id}
                className="bg-surface border border-line rounded-xl p-5 card-hover flex flex-col gap-4"
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-0.5 rounded-md border ${langColor(error.language)}`}>
                    {error.language}
                  </span>
                  <span className="text-xs text-zinc-600">
                    {new Date(error.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Error preview */}
                <p className="text-xs text-zinc-500 font-mono leading-relaxed line-clamp-3">
                  {error.errorText}
                </p>

                {/* Explanation (expanded) */}
                {expanded === error._id && error.explanation && (
                  <div className="text-xs text-zinc-400 leading-relaxed border-t border-line pt-4 tab-content">
                    <p className="text-zinc-500 text-xs mb-1 uppercase tracking-wider font-medium">Solution</p>
                    {error.explanation}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between mt-auto">
                  <button
                    onClick={(e) => handleUpvote(e, error._id)}
                    className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-violet-400 border border-line hover:border-violet-600/40 px-3 py-1.5 rounded-md transition-all duration-150"
                  >
                    ↑ {error.upvotes || 0}
                  </button>

                  <button
                    onClick={() => setExpanded(expanded === error._id ? null : error._id)}
                    className="text-xs text-zinc-500 hover:text-zinc-300 border border-line hover:border-zinc-600 px-3 py-1.5 rounded-md transition-all duration-150"
                  >
                    {expanded === error._id ? 'Hide' : 'View Solution'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {total > 12 && (
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="text-xs text-zinc-500 hover:text-zinc-300 border border-line hover:border-zinc-600 px-3 py-1.5 rounded-md transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ← Previous
              </button>
              <span className="text-xs text-zinc-600">Page {page} of {Math.ceil(total / 12)}</span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page * 12 >= total}
                className="text-xs text-zinc-500 hover:text-zinc-300 border border-line hover:border-zinc-600 px-3 py-1.5 rounded-md transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-24">
          <div className="text-4xl mb-4">🌐</div>
          <p className="text-zinc-500 text-sm">No community errors yet.</p>
          <p className="text-zinc-600 text-xs mt-1">Be the first to share a solved error.</p>
        </div>
      )}
    </div>
  );
}
