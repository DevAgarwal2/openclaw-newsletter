'use client';

import * as React from 'react';

interface Release {
  tag_name: string;
  name: string;
  body: string;
  published_at: string;
  html_url: string;
}

export function HeroRelease() {
  const [release, setRelease] = React.useState<Release | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchRelease() {
      try {
        const response = await fetch('/api/release');
        const result = await response.json();
        
        if (result.success) {
          setRelease(result.data);
        }
      } catch (err) {
        console.error('Failed to fetch release:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchRelease();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#1a1a1a] p-6 font-mono text-xs">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
          <div className="w-2 h-2 rounded-full bg-[#ea580c] animate-pulse"></div>
          <span className="text-[#737373]">Loading...</span>
        </div>
        <div className="space-y-2 text-[#e5e5e5]">
          <p>Fetching latest release...</p>
        </div>
      </div>
    );
  }

  if (!release) {
    return (
      <div className="bg-[#1a1a1a] p-6 font-mono text-xs">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
          <div className="w-2 h-2 rounded-full bg-[#ea580c]"></div>
          <span className="text-[#737373]">Latest Release</span>
        </div>
        <div className="space-y-1 text-[#e5e5e5]">
          <p>Unable to fetch release</p>
        </div>
      </div>
    );
  }

  // Parse the changelog for key items
  const changes = release.body
    .split('\n')
    .filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'))
    .slice(0, 3)
    .map(line => line.replace(/^[-*]\s*/, ''));

  return (
    <div className="bg-[#1a1a1a] p-6 font-mono text-xs">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
        <div className="w-2 h-2 rounded-full bg-[#ea580c]"></div>
        <span className="text-[#737373]">Latest Release</span>
      </div>
      <div className="space-y-1 text-[#e5e5e5]">
        <p>Version: {release.tag_name} 🦞</p>
        <p>Date: {new Date(release.published_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}</p>
        <br/>
        <p className="text-[#059669]">What is New:</p>
        {changes.map((change, idx) => (
          <p key={idx}>• {change}</p>
        ))}
        {changes.length === 0 && <p>• See full changelog on GitHub</p>}
      </div>
    </div>
  );
}