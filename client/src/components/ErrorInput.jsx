import React, { useState } from 'react';

const LANGUAGES = [
  'Unknown',
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'C++',
  'C#',
  'Go',
  'Rust',
  'Ruby',
  'PHP',
  'Swift',
  'Kotlin',
];

export default function ErrorInput({ onAnalyze, loading }) {
  const [errorText, setErrorText] = useState('');
  const [language, setLanguage] = useState('Unknown');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (errorText.trim()) {
      onAnalyze(errorText, language);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="input-wrapper rounded-xl border border-line bg-surface overflow-hidden transition-all duration-150">
        <textarea
          value={errorText}
          onChange={(e) => setErrorText(e.target.value)}
          placeholder="Paste your error or stack trace here..."
          disabled={loading}
          className="w-full bg-transparent p-5 text-sm text-neutral-200 placeholder-zinc-600 font-mono resize-none min-h-[200px] focus:outline-none leading-relaxed"
        />
        <div className="px-4 py-3 border-t border-line flex items-center justify-between gap-4 bg-surface">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            disabled={loading}
            className="bg-neutral-950 text-zinc-400 text-sm border border-line rounded-md px-3 py-1.5 focus:outline-none focus:border-violet-600 cursor-pointer appearance-none pr-8"
            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2371717a' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center', backgroundSize: '16px' }}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang} className="bg-neutral-950">
                {lang}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={loading || !errorText.trim()}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-5 py-2 rounded-md transition-colors duration-150 shrink-0"
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full spin" />
                Analyzing...
              </>
            ) : (
              <>
                <span>⚡</span>
                Analyze Error
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
