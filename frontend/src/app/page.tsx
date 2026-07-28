"use client";
import React, { useState, useEffect } from 'react';
import { Sidebar, NavigationTab } from '../components/layout/Sidebar';
import { Navbar } from '../components/layout/Navbar';
import { GlobalSearchModal } from '../components/common/GlobalSearchModal';
import { QuickScannerWidget } from '../components/dashboard/QuickScannerWidget';
import { MetricsOverview } from '../components/dashboard/MetricsOverview';
import { AuditDetailView } from '../components/audit/AuditDetailView';
import { CRMPipelineView } from '../components/crm/CRMPipelineView';
import { OutreachHubView } from '../components/outreach/OutreachHubView';
import { LandingPageRewriteLab } from '../components/rewrites/LandingPageRewriteLab';
import { SettingsView } from '../components/settings/SettingsView';
import { fetchAuditsList, fetchCRMLeads, AuditResult, CRMLead, getPDFReportUrl } from '../lib/api';
import { Search, ExternalLink, ArrowRight, Download, Globe, FileText, Send, Sparkles } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [audits, setAudits] = useState<AuditResult[]>([]);
  const [crmLeads, setCrmLeads] = useState<CRMLead[]>([]);
  const [selectedAudit, setSelectedAudit] = useState<AuditResult | null>(null);

  // Load initial audits and CRM leads
  const loadData = async () => {
    try {
      const [auditData, leadData] = await Promise.all([fetchAuditsList(), fetchCRMLeads()]);
      setAudits(auditData);
      setCrmLeads(leadData);
    } catch (e) {
      console.error("Error fetching data:", e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAuditComplete = (newAudit: AuditResult) => {
    setAudits((prev) => [newAudit, ...prev]);
    setSelectedAudit(newAudit);
    setActiveTab('audits');
    loadData();
  };

  const handleSelectAuditById = (id: string) => {
    const found = audits.find((a) => a.id === id);
    if (found) {
      setSelectedAudit(found);
      setActiveTab('audits');
    }
  };

  const tabTitles: Record<NavigationTab, string> = {
    dashboard: 'Agency Growth Dashboard',
    audits: selectedAudit ? `Audit: ${selectedAudit.company_name}` : 'E-Commerce Growth Audits',
    crm: 'CRM Pipeline & Lead Tracker',
    outreach: 'Multi-Channel Sales Outreach Hub',
    proposals: 'Proposals & PDF Reports',
    rewrites: 'AI Landing Page Rewrite Lab',
    settings: 'Agency Settings & API Keys'
  };

  return (
    <div className="flex min-h-screen bg-[#090D16] text-slate-100 font-sans antialiased">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'audits' && !selectedAudit && audits.length > 0) {
            setSelectedAudit(audits[0]);
          }
          setActiveTab(tab);
        }}
        auditCount={audits.length}
        crmCount={crmLeads.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <Navbar
          onOpenSearch={() => setIsSearchOpen(true)}
          activeTabTitle={tabTitles[activeTab]}
        />

        {/* Global Search Modal (Cmd + K) */}
        <GlobalSearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          audits={audits}
          crmLeads={crmLeads}
          onSelectAudit={handleSelectAuditById}
          onSelectLead={(id) => setActiveTab('crm')}
        />

        {/* Page Body */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6 overflow-y-auto">
          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Quick Scanner Widget */}
              <QuickScannerWidget onScanComplete={handleAuditComplete} />

              {/* Metrics Overview Cards */}
              <MetricsOverview audits={audits} crmLeads={crmLeads} />

              {/* Recent Audits Table & Quick Launch */}
              <div className="bg-[#111827] border border-[#1F2937] rounded-[10px] p-5 space-y-4 shadow-card">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <Search className="w-4 h-4 text-blue-500" /> Recent E-Commerce Audits
                  </h3>
                  <button
                    onClick={() => setActiveTab('audits')}
                    className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    View All Audits <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-[#0B0F17] text-slate-400 uppercase text-[10px] font-semibold border-b border-[#1F2937]">
                      <tr>
                        <th className="p-3">Store</th>
                        <th className="p-3">Growth Score</th>
                        <th className="p-3">Est. ARR Opportunity</th>
                        <th className="p-3">Date Scanned</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1F2937]">
                      {audits.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-6 text-center text-slate-500 italic">
                            No audits performed yet. Paste a website URL above to start!
                          </td>
                        </tr>
                      ) : (
                        audits.slice(0, 5).map((audit) => (
                          <tr key={audit.id} className="hover:bg-[#0B0F17]/50 transition-colors">
                            <td className="p-3">
                              <div className="font-bold text-slate-100">{audit.company_name}</div>
                              <div className="text-[10px] text-slate-400 font-mono">{audit.domain}</div>
                            </td>
                            <td className="p-3 font-mono font-bold text-blue-400">
                              {audit.overall_growth_score}/100
                            </td>
                            <td className="p-3 font-mono font-bold text-emerald-400">
                              +${((audit.revenue_opportunity?.annual_revenue_lift || 0) / 1000).toFixed(0)}k/yr
                            </td>
                            <td className="p-3 font-mono text-slate-400">
                              {new Date(audit.created_at).toLocaleDateString()}
                            </td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => {
                                  setSelectedAudit(audit);
                                  setActiveTab('audits');
                                }}
                                className="px-3 py-1 bg-[#0B0F17] hover:bg-[#1F2937] text-xs font-semibold text-blue-400 rounded-[6px] border border-[#1F2937]"
                              >
                                Open Teardown
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* AUDITS TAB */}
          {activeTab === 'audits' && (
            selectedAudit ? (
              <AuditDetailView
                audit={selectedAudit}
                onBack={() => setSelectedAudit(null)}
                onOpenOutreach={(auditId) => setActiveTab('outreach')}
              />
            ) : (
              <div className="space-y-4">
                <QuickScannerWidget onScanComplete={handleAuditComplete} />
                <div className="bg-[#111827] border border-[#1F2937] rounded-[10px] p-5 space-y-3">
                  <h3 className="text-sm font-bold text-slate-100">All Completed Audits</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {audits.map((a) => (
                      <div
                        key={a.id}
                        onClick={() => setSelectedAudit(a)}
                        className="p-4 bg-[#0B0F17] border border-[#1F2937] rounded-[10px] hover:border-blue-500/50 transition-all cursor-pointer space-y-3 group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-bold text-slate-100 group-hover:text-blue-400 transition-colors">
                            {a.company_name}
                          </div>
                          <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                            {a.overall_growth_score}/100
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 font-mono">{a.domain}</div>
                        <div className="flex justify-between items-baseline pt-2 border-t border-[#1F2937] text-xs">
                          <span className="text-slate-400">Est ARR Lift:</span>
                          <span className="font-mono font-bold text-emerald-400">
                            +${((a.revenue_opportunity?.annual_revenue_lift || 0) / 1000).toFixed(0)}k/yr
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          )}

          {/* CRM TAB */}
          {activeTab === 'crm' && (
            <CRMPipelineView
              leads={crmLeads}
              onRefreshLeads={loadData}
              onSelectAudit={handleSelectAuditById}
            />
          )}

          {/* OUTREACH TAB */}
          {activeTab === 'outreach' && (
            <OutreachHubView
              audits={audits}
              selectedAuditId={selectedAudit?.id}
            />
          )}

          {/* PROPOSALS TAB */}
          {activeTab === 'proposals' && (
            <div className="bg-[#111827] border border-[#1F2937] rounded-[10px] p-6 space-y-4">
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-500" /> Executive Proposals & PDF Hub
              </h2>
              <p className="text-xs text-slate-400">
                Download beautifully formatted multi-page PDF audit reports with executive summaries, metrics, and friction teardowns.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {audits.map((a) => (
                  <div key={a.id} className="p-4 bg-[#0B0F17] border border-[#1F2937] rounded-[10px] space-y-3">
                    <div className="font-bold text-slate-100">{a.company_name}</div>
                    <div className="text-xs text-slate-400 font-mono">{a.domain}</div>
                    <a
                      href={getPDFReportUrl(a.id)}
                      download={`GrowthPilot_${a.domain}_Report.pdf`}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-[8px] flex items-center justify-center space-x-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF Brief</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* REWRITES TAB */}
          {activeTab === 'rewrites' && (
            <LandingPageRewriteLab
              audits={audits}
              selectedAuditId={selectedAudit?.id}
            />
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>
    </div>
  );
}
