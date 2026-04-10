import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import toast from 'react-hot-toast';

export default function CodeFixBlock({ fix }) {
  const [copied, setCopied] = useState(false);

  if (!fix) {
    return <p className="text-zinc-500 text-sm">No fix available.</p>;
  }

  const code = typeof fix === 'string' ? fix : (fix.code || '');
  const description = typeof fix === 'object' ? fix.description : null;

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      {description && (
        <p className="text-zinc-300 text-sm leading-relaxed mb-4">{description}</p>
      )}
      <div className="relative rounded-lg overflow-hidden border border-line">
        <button
          onClick={copy}
          className="absolute top-3 right-3 z-10 text-xs text-zinc-400 hover:text-neutral-100 bg-[#1a1a1a] border border-line px-2.5 py-1 rounded-md transition-colors duration-150"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
        <SyntaxHighlighter
          language="javascript"
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: '1.25rem 1.5rem',
            background: '#1a1a1a',
            fontSize: '0.8125rem',
            lineHeight: '1.65',
          }}
        >
          {code || '// No code provided'}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
