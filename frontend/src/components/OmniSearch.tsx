"use client";
import React, { useState, useEffect } from 'react';
import { searchMemory, SearchResult } from '../lib/api';
import { Search, Command, Globe, FileText, Code, Terminal, Sparkles, ExternalLink, Zap } from 'lucide-react';

export const OmniSearch = () => {
  const [query, setQuery] = useState('');
  const [activeSource, setActiveSource] = useState('all');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [latencyMs, setLatencyMs] = useState<number>(24.5);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      searchMemory(query, activeSource).then((data) => {
        setResults(data.results);
        setLatencyMs(data.latencyMs);
        setLoading(false);
      });
    }, 150);
    return () => clearTimeout(timer);
  }, [query, activeSource]);

  const getSourceBadge = (source: string) => {
    switch (source) {
      case 'code':
        return <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-2 py-0.5 rounded-full"><Code className="w-3 h-3" /> Code</span>;
      case 'notes':
        return <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded-full"><FileText className="w-3 h-3" /> Notes</span>;
      case 'chrome':
      case 'arc':
      case 'safari':
        return <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-blue-400 bg-blue-950/60 border border-blue-800/50 px-2 py-0.5 rounded-full"><Globe className="w-3 h-3" /> Web</span>;
      default:
        return <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-purple-400 bg-purple-950/60 border border-purple-800/50 px-2 py-0.5 rounded-full"><Sparkles className="w-3 h-3" /> {source}</span>;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
      <div className="relative flex items-center bg-slate-900/90 border border-slate-800 focus-within:border-cyan-500 rounded-2xl p-4 shadow-2xl backdrop-blur-2xl transition-all">
        <Search className="w-6 h-6 text-slate-400 mr-3 flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search MacBook memory (e.g., PyTorch legal translation, MCP tools, ONNX benchmarks)..."
          className="w-full bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none text-base sm:text-lg"
        />
        <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
          <div className="hidden sm:flex items-center space-x-1 text-xs bg-slate-800/80 border border-slate-700 text-slate-400 px-2.5 py-1 rounded-lg">
            <Command className="w-3.5 h-3.5" />
            <span>K</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-2 px-1">
        <div className="flex items-center space-x-1.5 overflow-x-auto py-1">
          {['all', 'code', 'notes', 'chrome', 'terminal'].map((src) => (
            <button
              key={src}
              onClick={() => setActiveSource(src)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                activeSource === src
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {src}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-1.5 text-xs text-slate-400 bg-slate-900/80 border border-slate-800 px-3 py-1 rounded-xl">
          <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>{latencyMs}ms Retrieval</span>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-sm animate-pulse">Querying local vector tables & FTS index...</div>
        ) : results.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">No matching memory items found. Try typing &apos;PyTorch&apos; or &apos;MCP&apos;.</div>
        ) : (
          results.map((item) => (
            <div key={item.id} className="p-4 bg-slate-900/40 border border-slate-800/80 hover:border-cyan-500/40 rounded-2xl backdrop-blur-md transition-all group">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center space-x-2.5 min-w-0">
                  {getSourceBadge(item.source)}
                  <h3 className="font-bold text-slate-200 group-hover:text-cyan-300 transition-colors text-sm sm:text-base truncate">{item.title}</h3>
                </div>
                <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded-lg flex-shrink-0">
                  {(item.score * 100).toFixed(0)}% Match
                </span>
              </div>
              
              <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">{item.snippet}</p>

              <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
                <span className="truncate font-mono">{item.path || item.url}</span>
                {item.url && (
                  <a href={item.url} target="_blank" rel="noreferrer" className="flex items-center space-x-1 text-cyan-400 hover:underline flex-shrink-0">
                    <span>Open Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
// Cmd+K listener update (18:07:44)
