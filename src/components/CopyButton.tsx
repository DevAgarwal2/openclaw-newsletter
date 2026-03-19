'use client';

import * as React from 'react';

export function CopyButton() {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    const url = 'https://openclaw-newsletter-agent.vercel.app/skill.md';
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#1a1a1a] text-[#1a1a1a] font-mono text-sm rounded-lg hover:bg-[#1a1a1a] hover:text-white transition-colors"
    >
      {copied ? 'Copied!' : 'Copy Link'}
      <span>→</span>
    </button>
  );
}
