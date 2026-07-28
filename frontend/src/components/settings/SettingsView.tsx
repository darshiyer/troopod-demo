"use client";
import React, { useState } from 'react';
import { Settings, Key, Shield, Check, Database, Zap } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [openaiKey, setOpenaiKey] = useState('sk-proj-••••••••••••••••••••••••');
  const [anthropicKey, setAnthropicKey] = useState('sk-ant-••••••••••••••••••••••••');
  const [supabaseUrl, setSupabaseUrl] = useState('https://xyzcompany.supabase.co');
  const [supabaseKey, setSupabaseKey] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.••••••••');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
      <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-[10px]">
        <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <Settings className="w-4 h-4 text-blue-500" /> Agency Settings & API Configuration
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Manage live API keys, Supabase database settings, and GrowthPilot agency integration credentials.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* API Credentials */}
        <div className="bg-[#111827] border border-[#1F2937] rounded-[10px] p-5 space-y-4 shadow-card">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Key className="w-4 h-4 text-blue-400" /> AI Provider API Keys
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">OpenAI API Key (GPT-4.1 / Vision)</label>
              <input
                type="password"
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                className="w-full px-3 py-2 bg-[#0B0F17] border border-[#1F2937] rounded-[8px] text-slate-200 font-mono focus:outline-none focus:border-blue-500"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">Isolated behind environment variables.</span>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Anthropic API Key (Claude Sonnet Fallback)</label>
              <input
                type="password"
                value={anthropicKey}
                onChange={(e) => setAnthropicKey(e.target.value)}
                className="w-full px-3 py-2 bg-[#0B0F17] border border-[#1F2937] rounded-[8px] text-slate-200 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Supabase PostgreSQL & Auth */}
        <div className="bg-[#111827] border border-[#1F2937] rounded-[10px] p-5 space-y-4 shadow-card">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" /> Supabase Database & Auth
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Supabase Project URL</label>
              <input
                type="text"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                className="w-full px-3 py-2 bg-[#0B0F17] border border-[#1F2937] rounded-[8px] text-slate-200 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Supabase Anon Key</label>
              <input
                type="password"
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
                className="w-full px-3 py-2 bg-[#0B0F17] border border-[#1F2937] rounded-[8px] text-slate-200 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-[10px] flex items-center space-x-2 transition-all shadow-glow"
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Settings Saved!</span>
              </>
            ) : (
              <span>Save Credentials</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
