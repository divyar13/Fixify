import React, { useState } from 'react';
import { analyzeError, shareError, getSimilarErrors } from '../api';
import ErrorInput from '../components/ErrorInput';
import ExplanationCard from '../components/ExplanationCard';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorId, setErrorId] = useState(null);
  const [language, setLanguage] = useState('Unknown');
  const [similar, setSimilar] = useState([]);
  const { token } = useAuth();

  const handleAnalyze = async (errorText, lang) => {
    try {
      setLoading(true);
      setLanguage(lang);
      setAnalysis(null);
      const res = await analyzeError(errorText, lang);
      setAnalysis(res.data.analysis);
      setErrorId(res.data.errorLogId);
      toast.success('Analysis complete');

      try {
        const simRes = await getSimilarErrors(lang);
        setSimilar(simRes.data || []);
      } catch { /* silent */ }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to analyze error');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!token) { toast.error('Login to share'); return; }
    if (!errorId) { toast.error('Error not saved'); return; }
    try {
      await shareError(errorId, true);
      toast.success('Shared with community!');
    } catch {
      toast.error('Failed to share');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 min-h-[calc(100vh-56px)] flex flex-col">
      <div className="pt-10 pb-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-neutral-100 tracking-tight leading-[1.1]">
          Debug Smarter,<br />Not Harder
        </h1>
        <p className="text-base text-zinc-500 mt-3">
          Paste any error. Get the fix instantly.
        </p>
      </div>

      <ErrorInput onAnalyze={handleAnalyze} loading={loading} />

      <div className="mt-5 flex-1 flex flex-col">
        {loading ? (
          <div className="flex-1 border border-line rounded-xl flex flex-col items-center justify-center gap-3 min-h-[200px]">
            <div className="w-5 h-5 border-2 border-line border-t-violet-600 rounded-full spin" />
            <p className="text-zinc-600 text-sm">Analyzing your error...</p>
          </div>
        ) : analysis ? (
          <>
            <ExplanationCard analysis={analysis} language={language} onShare={handleShare} />
            {similar.length > 0 && (
              <div className="mt-4 bg-surface border border-line rounded-xl p-6">
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium mb-4">
                  Similar from community
                </p>
                <div className="space-y-3">
                  {similar.map((err) => (
                    <div key={err._id} className="flex items-start justify-between gap-4 py-3 border-t border-line first:border-0 first:pt-0">
                      <p className="text-xs text-zinc-500 font-mono line-clamp-2 flex-1 leading-relaxed">
                        {err.errorText?.slice(0, 100)}
                      </p>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-zinc-600">{err.language}</span>
                        <span className="text-xs text-violet-500">↑ {err.upvotes}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 border border-dashed border-line rounded-xl flex items-center justify-center min-h-[200px]">
            <p className="text-zinc-600 text-sm">Your analysis will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
