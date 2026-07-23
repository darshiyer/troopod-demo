"use client";
import React, { useState, useEffect } from 'react';
import { fetchDailyTimeline, TimelineItem } from '../lib/api';
import { Clock, Globe, FileText, Code, Terminal, Sparkles, CheckCircle2 } from 'lucide-react';

export const TimelineView = () => {
  const [items, setItems] = useState<TimelineItem[]>([]);
  const [standupGenerated, setStandupGenerated] = useState(false);

  useEffect(() => {
    fetchDailyTimeline().then(setItems);
  }, []);

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'chrome': return <Globe className="w-4 h-4 text-cyan-400" />;
      case 'notes': return <FileText className="w-4 h-4 text-emerald-400" />;
      case 'code': return <Code className="w-4 h-4 text-indigo-400" />;
      case 'terminal': return <Terminal className="w-4 h-4 text-amber-400" />;
      default: return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between bg-slate-900/60 p-4 rounded-2xl border border-slate-800 backdrop-blur-xl">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            Daily Activity Digest
          </h2>
          <p className="text-xs text-slate-400 mt-1">Chronological story of your research, code edits, and notes today</p>
        </div>
        <button
          onClick={() => setStandupGenerated(true)}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold text-xs shadow-lg shadow-cyan-500/20 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Generate Standup Summary</span>
        </button>
      </div>

      {standupGenerated && (
        <div className="p-4 bg-cyan-950/40 border border-cyan-500/30 rounded-2xl backdrop-blur-md animate-in fade-in duration-300">
          <div className="flex items-center space-x-2 text-cyan-400 text-sm font-semibold mb-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Daily Standup Digest (Ready to copy)</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
            <li>Researched Model Context Protocol (MCP) tool schemas & JSON-RPC specs.</li>
            <li>Implemented RAG hybrid retrieval algorithm combining LanceDB vector tables & FTS5.</li>
            <li>Optimized local FastAPI service latency to 24ms with ONNX embeddings.</li>
          </ul>
        </div>
      )}

      <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        {items.map((item) => (
          <div key={item.id} className="relative group">
            <div className="absolute -left-6 top-1.5 w-6 h-6 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center group-hover:border-cyan-400 transition-colors">
              {getSourceIcon(item.source)}
            </div>
            <div className="p-4 bg-slate-900/40 border border-slate-800/80 rounded-xl hover:border-slate-700 transition-all backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-cyan-400">{item.hour}</span>
                <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 px-2 py-0.5 rounded bg-slate-800">{item.source}</span>
              </div>
              <h3 className="text-sm font-semibold text-slate-200 mt-1">{item.title}</h3>
              <p className="text-xs text-slate-400 mt-1">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
