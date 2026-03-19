'use client';

import * as React from 'react';

interface Release {
  tag_name: string;
  name: string;
  body: string;
  published_at: string;
  html_url: string;
}

export function LatestRelease() {
  const [release, setRelease] = React.useState<Release | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchRelease() {
      try {
        const response = await fetch('/api/release');
        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch release');
        }
        
        setRelease(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchRelease();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#f5f3ef] border border-[#1a1a1a]/10 p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-[#1a1a1a]/10 w-1/3"></div>
          <div className="h-4 bg-[#1a1a1a]/10 w-1/4"></div>
          <div className="h-32 bg-[#1a1a1a]/10 w-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#fef2f2] border border-[#ef4444]/20 p-8">
        <p className="text-[#dc2626] font-mono text-sm">Error: {error}</p>
      </div>
    );
  }

  if (!release) {
    return null;
  }

  // Parse the changelog
  const changes = release.body.split('\n').filter(line => 
    line.startsWith('-') || line.startsWith('*')
  ).slice(0, 6);

  return (
    <div className="bg-[#f5f3ef] border border-[#1a1a1a]/10">
      {/* Header */}
      <div className="flex items-baseline justify-between border-b border-[#1a1a1a]/10 p-6">
        <div>
          <h4 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[#1a1a1a]">
            {release.tag_name}
          </h4>
          <p className="font-mono text-xs text-[#737373] mt-1">
            {new Date(release.published_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
        <a
          href={release.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs text-[#ea580c] hover:underline"
        >
          View on GitHub →
        </a>
      </div>

      {/* Body */}
      <div className="p-6 font-mono text-sm">
        <p className="text-[#737373] text-xs mb-4">Recent changes:</p>
        
        <ul className="space-y-3">
          {changes.map((change, idx) => (
            <li key={idx} className="text-[#3d3d3d] flex items-start gap-3">
              <span className="text-[#ea580c] mt-1">—</span>
              <span>{change.replace(/^[-*]\s*/, '')}</span>
            </li>
          ))}
        </ul>

        {changes.length === 6 && (
          <p className="text-[#737373] mt-4 text-xs">...and more</p>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-[#1a1a1a]/10 p-4 flex items-center justify-between font-mono text-xs">
        <span className="text-[#737373]">github.com/openclaw/openclaw</span>
        <span className="text-[#059669] flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#059669] rounded-full"></span>
          Live
        </span>
      </div>
    </div>
  );
}
