"use client";
import React, { useState } from 'react';
import { Network, Database, Sparkles, Layers } from 'lucide-react';

export const KnowledgeGraphView = () => {
  const [selectedNode, setSelectedNode] = useState<string | null>("OmniBrain Core Engine");

  const nodes = [
    { id: "n1", label: "OmniBrain Core Engine", group: "code", color: "bg-cyan-500", desc: "FastAPI local service orchestrating indexers, extractors, and search endpoints." },
    { id: "n2", label: "Model Context Protocol", group: "mcp", color: "bg-purple-500", desc: "Exposes laptop memory tools to Cursor & Claude Desktop via standard MCP." },
    { id: "n3", label: "LanceDB mmap Vector Store", group: "db", color: "bg-emerald-500", desc: "Zero PyTorch RAM mmap vector tables executing sub-50ms lookups." },
    { id: "n4", label: "SQLite FTS5 Full-Text Index", group: "db", color: "bg-blue-500", desc: "Instant keyword search matching titles, snippets, and URLs." },
    { id: "n5", label: "Obsidian Vault Notes", group: "notes", color: "bg-amber-500", desc: "Markdown document parser with frontmatter & chunk extraction." }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 backdrop-blur-xl flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Network className="w-5 h-5 text-purple-400" />
            Interactive Knowledge Graph
          </h2>
          <p className="text-xs text-slate-400 mt-1">Automatic 2D topological mapping connecting Notes 🔗 Chrome 🔗 Code 🔗 Terminal</p>
        </div>
        <div className="flex items-center space-x-2 text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>5 Nodes • 6 Edges</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 p-6 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-md min-h-[340px] flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
          
          <div className="relative z-10 flex flex-wrap items-center justify-center gap-6 p-4">
            {nodes.map((node) => (
              <button
                key={node.id}
                onClick={() => setSelectedNode(node.label)}
                className={`p-4 rounded-2xl border transition-all flex flex-col items-center space-y-2 shadow-xl ${
                  selectedNode === node.label
                    ? 'border-cyan-400 bg-slate-800 scale-105 shadow-cyan-500/20'
                    : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
                }`}
              >
                <div className={`w-4 h-4 rounded-full ${node.color} animate-pulse`} />
                <span className="text-xs font-semibold text-slate-200">{node.label}</span>
              </button>
            ))}
          </div>

          <div className="mt-8 text-xs text-slate-500 flex items-center space-x-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Click any node to inspect entity relationships</span>
          </div>
        </div>

        <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Database className="w-4 h-4" />
              <span>Node Inspector</span>
            </div>
            <h3 className="text-base font-bold text-slate-100">{selectedNode || "Select a Node"}</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              {nodes.find(n => n.label === selectedNode)?.desc || "Click a node on the visual canvas to inspect properties and entity links."}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 text-xs text-slate-500 space-y-1">
            <p>• Clustering Method: Temporal Window (15m)</p>
            <p>• Cosine Threshold: &gt; 0.82</p>
            <p>• MCP Tool Target: Registered</p>
          </div>
        </div>
      </div>
    </div>
  );
};
