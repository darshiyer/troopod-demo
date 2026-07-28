"use client";
import React, { useState, useEffect } from 'react';
import { Search, X, ArrowRight, ExternalLink, Globe, Users, FileText } from 'lucide-react';
import { AuditResult, CRMLead } from '../../lib/api';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  audits: AuditResult[];
  crmLeads: CRMLead[];
  onSelectAudit: (id: string) => void;
  onSelectLead: (id: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  audits,
  crmLeads,
  onSelectAudit,
  onSelectLead,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? onClose() : null;
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredAudits = audits.filter(
    (a) =>
      a.company_name.toLowerCase().includes(query.toLowerCase()) ||
      a.domain.toLowerCase().includes(query.toLowerCase())
  );

  const filteredLeads = crmLeads.filter(
    (l) =>
      l.company_name.toLowerCase().includes(query.toLowerCase()) ||
      l.domain.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
      <div className="bg-[#0B0F17] border border-[#1F2937] w-full max-w-xl rounded-[10px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Header */}
        <div className="p-3.5 border-b border-[#1F2937] flex items-center justify-between">
          <div className="flex items-center space-x-2.5 flex-1">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              autoFocus
              placeholder="Search company audits, domains, or CRM pipeline..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none w-full"
            />
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded bg-[#111827] text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-4 text-xs">
          {/* Audits Group */}
          <div>
            <div className="px-2 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Completed Audits ({filteredAudits.length})</span>
              <Globe className="w-3 h-3 text-slate-500" />
            </div>
            {filteredAudits.length === 0 ? (
              <div className="px-3 py-2 text-slate-500 italic">No matching audits found</div>
            ) : (
              filteredAudits.map((a) => (
                <button
                  key={a.id}
                  onClick={() => {
                    onSelectAudit(a.id);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-[8px] hover:bg-[#111827] text-left transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-7 h-7 rounded bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                      {a.company_name[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-200 group-hover:text-blue-400 transition-colors">
                        {a.company_name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">{a.domain}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-emerald-400 font-semibold">
                      +{a.revenue_opportunity?.annual_revenue_lift ? `$${(a.revenue_opportunity.annual_revenue_lift / 1000).toFixed(0)}k/yr` : ''}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-200 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </button>
              ))
            )}
          </div>

          {/* CRM Leads Group */}
          <div>
            <div className="px-2 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>CRM Leads ({filteredLeads.length})</span>
              <Users className="w-3 h-3 text-slate-500" />
            </div>
            {filteredLeads.length === 0 ? (
              <div className="px-3 py-2 text-slate-500 italic">No matching CRM leads</div>
            ) : (
              filteredLeads.map((l) => (
                <button
                  key={l.id}
                  onClick={() => {
                    onSelectLead(l.id);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-[8px] hover:bg-[#111827] text-left transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-7 h-7 rounded bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                      {l.company_name[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-200 group-hover:text-indigo-400 transition-colors">
                        {l.company_name}
                      </div>
                      <div className="text-[10px] text-slate-400">{l.status} • {l.contact_email || 'No Email'}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1F2937] text-slate-300">
                    {l.status}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Footer shortcuts */}
        <div className="px-3 py-2 bg-[#111827] border-t border-[#1F2937] text-[10px] text-slate-400 flex items-center justify-between font-mono">
          <span>Navigate with ↑ ↓</span>
          <span>Esc to Close</span>
        </div>
      </div>
    </div>
  );
};
