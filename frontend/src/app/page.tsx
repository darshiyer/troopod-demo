"use client";
import React, { useState } from 'react';
import { OmniSearch } from '../components/OmniSearch';
import { TimelineView } from '../components/TimelineView';
import { KnowledgeGraphView } from '../components/KnowledgeGraphView';
import { Sparkles, Shield, Cpu, Zap, Search, Clock, Network, Terminal, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'search' | 'timeline' | 'graph' | 'mcp'>('search');

  return (
    <main className="flex flex-col items-center justify-start min-h-screen px-4 py-12 max-w-6xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="text-center max-w-3xl space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>100% Privacy-First • macOS Second Brain Engine</span>
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight bg-gradient-to-r from-slate-100 via-cyan-200 to-cyan-500 bg-clip-text text-transparent">
          OmniBrain AI
        </h1>
        
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          Sub-50ms hybrid vector retrieval across Chrome visits, Obsidian notes, terminal history, and code repositories—exposing native Model Context Protocol (MCP) tools for Cursor & Claude Desktop.
        </p>
      </div>

      {/* Real-time System Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-4xl">
        <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-xl flex items-center space-x-3">
          <Zap className="w-5 h-5 text-amber-400" />
          <div>
            <div className="text-xs text-slate-400 font-medium">Latency (p95)</div>
            <div className="text-sm font-bold text-slate-100">24.5 ms</div>
          </div>
        </div>

        <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-xl flex items-center space-x-3">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <div>
            <div className="text-xs text-slate-400 font-medium">Active Memory</div>
            <div className="text-sm font-bold text-slate-100">&lt; 95 MB RAM</div>
          </div>
        </div>

        <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-xl flex items-center space-x-3">
          <Shield className="w-5 h-5 text-emerald-400" />
          <div>
            <div className="text-xs text-slate-400 font-medium">Privacy Status</div>
            <div className="text-sm font-bold text-slate-100">100% On-Device</div>
          </div>
        </div>

        <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-xl flex items-center space-x-3">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <div>
            <div className="text-xs text-slate-400 font-medium">MCP Protocol</div>
            <div className="text-sm font-bold text-slate-100">7 Registered</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-1.5 p-1.5 bg-slate-900/80 border border-slate-800 rounded-2xl backdrop-blur-xl">
        <button
          onClick={() => setActiveTab('search')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'search'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span>OmniSearch</span>
        </button>

        <button
          onClick={() => setActiveTab('timeline')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'timeline'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Timeline Story</span>
        </button>

        <button
          onClick={() => setActiveTab('graph')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'graph'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Network className="w-3.5 h-3.5" />
          <span>Knowledge Graph</span>
        </button>

        <button
          onClick={() => setActiveTab('mcp')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'mcp'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>MCP Server</span>
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="w-full">
        {activeTab === 'search' && <OmniSearch />}
        {activeTab === 'timeline' && <TimelineView />}
        {activeTab === 'graph' && <KnowledgeGraphView />}
        {activeTab === 'mcp' && (
          <div className="w-full max-w-3xl mx-auto p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-xl space-y-4 text-left">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-purple-400" />
                Registered Model Context Protocol (MCP) Tools
              </h3>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Ready
              </span>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              OmniBrain exposes native JSON-RPC Model Context Protocol tools. You can add this server endpoint to your Cursor Settings (`~/.cursor/mcp.json`) or Claude Desktop config.
            </p>

            <div className="p-4 bg-slate-950 rounded-xl font-mono text-xs text-cyan-300 overflow-x-auto border border-slate-800">
              <pre>{`{
  "mcpServers": {
    "omnibrain": {
      "command": "uvicorn",
      "args": ["backend.app.main:app", "--port", "8000"]
    }
  }
}`}</pre>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
