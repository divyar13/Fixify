import React, { useState, useEffect } from 'react';
import { getUserHistory, deleteError, updateError } from '../api';
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
  PHP:        'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  Swift:      'bg-orange-400/10 text-orange-300 border-orange-400/20',
  Kotlin:     'bg-violet-500/10 text-violet-400 border-violet-500/20',
};

const langColor = (lang) =>
  LANG_COLORS[lang] || 'bg-zinc-700/20 text-zinc-400 border-zinc-700/30';

const FILTER_LANGS = ['JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'Rust'];

export default function HistoryList({ onSelectError, selectedId }) {
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [language, setLanguage] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadHistory();
  }, [search, language, page]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const res = await getUserHistory(search, language, null, page, 10);
      setErrors(res.data.errors);
      setTotal(res.data.total);
    } catch {
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Delete this error?')) return;
    try {
      await deleteError(id);
      toast.success('Deleted');
      loadHistory();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const toggleSolved = async (e, error) => {
    e.stopPropagation();
    try {
      await updateError(error._id, error.userNotes, error.tags, !error.isSolved);
      loadHistory();
    } catch {
      toast.error('Failed to update');
    }
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search errors..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full bg-surface border border-line rounded-lg pl-9 pr-3 py-2 text-sm text-neutral-200 placeholder-zinc-600 focus:outline-none focus:border-violet-600 transition-colors"
        />
      </div>

      {/* Language filter pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => { setLanguage(''); setPage(1); }}
          className={`text-xs px-3 py-1 rounded-md border transition-all duration-150 ${
            language === ''
              ? 'bg-violet-600/10 text-violet-400 border-violet-600/40'
              : 'text-zinc-500 border-line hover:border-zinc-600 hover:text-zinc-300'
          }`}
        >
          All
        </button>
        {FILTER_LANGS.map((lang) => (
          <button
            key={lang}
            onClick={() => { setLanguage(lang); setPage(1); }}
            className={`text-xs px-3 py-1 rounded-md border transition-all duration-150 ${
              language === lang
                ? 'bg-violet-600/10 text-violet-400 border-violet-600/40'
                : 'text-zinc-500 border-line hover:border-zinc-600 hover:text-zinc-300'
            }`}
          >
            {lang}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-5 h-5 border-2 border-line border-t-violet-600 rounded-full spin" />
        </div>
      ) : errors.length ? (
        <div className="space-y-2">
          {errors.map((error) => (
            <div
              key={error._id}
              onClick={() => onSelectError(error)}
              className={`bg-surface border rounded-xl p-4 cursor-pointer card-hover ${
                selectedId === error._id ? 'border-violet-600/50' : 'border-line'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`text-xs px-2 py-0.5 rounded-md border shrink-0 ${langColor(error.language)}`}>
                    {error.language}
                  </span>
                  {error.isSolved && (
                    <span className="text-xs text-emerald-500 shrink-0">✓ Solved</span>
                  )}
                </div>
                <span className="text-xs text-zinc-600 shrink-0">
                  {new Date(error.createdAt).toLocaleDateString()}
                </span>
              </div>

              <p className="text-xs text-zinc-500 font-mono line-clamp-2 leading-relaxed">
                {error.errorText?.slice(0, 120)}
              </p>

              <div className="flex gap-1.5 mt-3">
                <button
                  onClick={(e) => toggleSolved(e, error)}
                  className="text-xs text-zinc-600 hover:text-zinc-400 border border-line hover:border-zinc-600 px-2.5 py-1 rounded-md transition-all duration-150"
                >
                  {error.isSolved ? 'Reopen' : 'Mark Solved'}
                </button>
                <button
                  onClick={(e) => handleDelete(e, error._id)}
                  className="text-xs text-zinc-600 hover:text-red-400 border border-line hover:border-red-500/30 px-2.5 py-1 rounded-md transition-all duration-150"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-3xl mb-3">🪲</div>
          <p className="text-zinc-500 text-sm">No errors saved yet.</p>
          <p className="text-zinc-600 text-xs mt-1">Start debugging to see your history.</p>
        </div>
      )}

      {/* Pagination */}
      {total > 10 && (
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="text-xs text-zinc-500 hover:text-zinc-300 border border-line hover:border-zinc-600 px-3 py-1.5 rounded-md transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Prev
          </button>
          <span className="text-xs text-zinc-600">
            {page} / {Math.ceil(total / 10)}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page * 10 >= total}
            className="text-xs text-zinc-500 hover:text-zinc-300 border border-line hover:border-zinc-600 px-3 py-1.5 rounded-md transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
