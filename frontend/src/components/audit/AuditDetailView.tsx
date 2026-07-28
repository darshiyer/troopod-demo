"use client";
import React, { useState } from 'react';
import { 
  ArrowLeft, Download, ExternalLink, Zap, Shield, Sparkles, AlertTriangle, 
  TrendingUp, Users, Send, FileText, CheckCircle2, ChevronRight, Eye, Flame, Gauge, Copy, Check
} from 'lucide-react';
import { AuditResult, getPDFReportUrl } from '../../lib/api';

interface AuditDetailViewProps {
  audit: AuditResult;
  onBack: () => void;
  onOpenOutreach?: (auditId: string) => void;
}

export const AuditDetailView: React.FC<AuditDetailViewProps> = ({ audit, onBack, onOpenOutreach }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'heatmap' | 'pagespeed' | 'friction' | 'competitors' | 'sales_assets'>('overview');
  
  // Interactive Revenue Calculator state
  const [traffic, setTraffic] = useState(audit.revenue_opportunity.estimated_monthly_traffic);
  const [aov, setAov] = useState(audit.revenue_opportunity.average_order_value);
  const [currentCr, setCurrentCr] = useState(audit.revenue_opportunity.current_conversion_rate);
  const [crLift, setCrLift] = useState(0.85); // +0.85% lift default

  const [heatmapLayer, setHeatmapLayer] = useState<'clicks' | 'attention' | 'scroll'>('clicks');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Recalculate dynamic revenue opportunity
  const targetCr = Number((currentCr + crLift).toFixed(2));
  const currentOrders = traffic * (currentCr / 100);
  const targetOrders = traffic * (targetCr / 100);
  const addedOrders = targetOrders - currentOrders;
  const monthlyLift = addedOrders * aov;
  const annualLift = monthlyLift * 12;

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111827] border border-[#1F2937] p-5 rounded-[10px]">
        <div className="flex items-center space-x-3.5">
          <button
            onClick={onBack}
            className="p-2 rounded-[8px] bg-[#0B0F17] border border-[#1F2937] text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-slate-100">{audit.company_name}</h1>
              <a
                href={audit.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-slate-400 font-mono flex items-center gap-1 hover:text-blue-400"
              >
                {audit.domain} <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Audited on {new Date(audit.created_at).toLocaleDateString()} • {audit.metadata.title}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          {onOpenOutreach && (
            <button
              onClick={() => onOpenOutreach(audit.id)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-[10px] flex items-center space-x-1.5 transition-all shadow-glow"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Outreach Hub</span>
            </button>
          )}

          <a
            href={getPDFReportUrl(audit.id)}
            download={`GrowthPilot_${audit.domain}_Audit.pdf`}
            className="px-4 py-2 bg-[#0B0F17] hover:bg-[#1F2937] border border-[#1F2937] text-slate-200 font-semibold text-xs rounded-[10px] flex items-center space-x-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>Download PDF Report</span>
          </a>
        </div>
      </div>

      {/* Main Score Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-4 bg-[#111827] border border-[#1F2937] rounded-[10px] flex flex-col justify-between">
          <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
            <span>Overall Growth Score</span>
            <Zap className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-1">
            <span className="text-3xl font-black font-mono text-white">{audit.overall_growth_score}</span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
        </div>

        <div className="p-4 bg-[#111827] border border-[#1F2937] rounded-[10px] flex flex-col justify-between">
          <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
            <span>Conversion Rate Score</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-1">
            <span className="text-3xl font-black font-mono text-emerald-400">{audit.conversion_score}</span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
        </div>

        <div className="p-4 bg-[#111827] border border-[#1F2937] rounded-[10px] flex flex-col justify-between">
          <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
            <span>Trust & Security</span>
            <Shield className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-1">
            <span className="text-3xl font-black font-mono text-indigo-400">{audit.trust_score}</span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
        </div>

        <div className="p-4 bg-[#111827] border border-[#1F2937] rounded-[10px] flex flex-col justify-between">
          <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
            <span>UX & Hierarchy</span>
            <Eye className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-1">
            <span className="text-3xl font-black font-mono text-amber-400">{audit.ux_score}</span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
        </div>

        <div className="p-4 bg-[#111827] border border-blue-500/30 rounded-[10px] flex flex-col justify-between bg-blue-950/10">
          <div className="text-xs text-blue-400 font-medium flex items-center justify-between">
            <span>Est. ARR Opportunity</span>
            <Sparkles className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black font-mono text-blue-400">${(annualLift / 1000).toFixed(0)}k</span>
            <span className="text-[10px] text-slate-400 block font-mono">/ year gain</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center space-x-1 border-b border-[#1F2937] pb-1 overflow-x-auto">
        {[
          { id: 'overview', label: 'Executive Audit' },
          { id: 'heatmap', label: 'Website Heatmap Visualizer' },
          { id: 'pagespeed', label: 'PageSpeed & Core Web Vitals' },
          { id: 'friction', label: `Friction Points (${audit.friction_points.length})` },
          { id: 'competitors', label: 'Competitor Research' },
          { id: 'sales_assets', label: 'Outreach & Sales Assets' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-[8px] text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#111827]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: EXECUTIVE OVERVIEW & REVENUE CALCULATOR */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Columns: AI Diagnosis Summary */}
          <div className="lg:col-span-2 space-y-5">
            {/* Business & Brand Summary */}
            <div className="bg-[#111827] border border-[#1F2937] rounded-[10px] p-5 space-y-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" /> Business Teardown Summary
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">{audit.analysis.business_summary}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-[#0B0F17] border border-[#1F2937] rounded-[8px]">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase">Target Audience</span>
                  <p className="text-xs text-slate-200 mt-1 font-medium">{audit.analysis.target_audience}</p>
                </div>
                <div className="p-3 bg-[#0B0F17] border border-[#1F2937] rounded-[8px]">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase">Value Proposition</span>
                  <p className="text-xs text-slate-200 mt-1 font-medium">{audit.analysis.value_proposition}</p>
                </div>
              </div>
            </div>

            {/* Key Growth Weaknesses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#111827] border border-[#1F2937] rounded-[10px] p-4 space-y-2">
                <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Weak Messaging & Copy
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-400">
                  {audit.analysis.weak_messaging.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#111827] border border-[#1F2937] rounded-[10px] p-4 space-y-2">
                <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-indigo-400" /> Trust & Security Gaps
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-400">
                  {audit.analysis.trust_issues.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-indigo-400 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Extracted Elements Summary */}
            <div className="bg-[#111827] border border-[#1F2937] rounded-[10px] p-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-200">Extracted Homepage Assets</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 bg-[#0B0F17] rounded-[8px] border border-[#1F2937]">
                  <div className="text-[10px] text-slate-500 font-medium">Primary Headlines</div>
                  <div className="font-semibold text-slate-200 truncate mt-0.5">{audit.extracted_elements.headlines[0] || 'N/A'}</div>
                </div>
                <div className="p-2.5 bg-[#0B0F17] rounded-[8px] border border-[#1F2937]">
                  <div className="text-[10px] text-slate-500 font-medium">Main CTA</div>
                  <div className="font-semibold text-blue-400 truncate mt-0.5">{audit.extracted_elements.ctas[0] || 'Shop Now'}</div>
                </div>
                <div className="p-2.5 bg-[#0B0F17] rounded-[8px] border border-[#1F2937]">
                  <div className="text-[10px] text-slate-500 font-medium">Testimonials Found</div>
                  <div className="font-semibold text-slate-200 font-mono mt-0.5">{audit.extracted_elements.testimonials.length} reviews</div>
                </div>
                <div className="p-2.5 bg-[#0B0F17] rounded-[8px] border border-[#1F2937]">
                  <div className="text-[10px] text-slate-500 font-medium">Live Support Chat</div>
                  <div className="font-semibold text-emerald-400 mt-0.5">{audit.extracted_elements.has_live_chat ? 'Active' : 'Missing'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Revenue Calculator */}
          <div className="bg-[#111827] border border-[#1F2937] rounded-[10px] p-5 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#1F2937]">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" /> Revenue Lift Calculator
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-800/40">
                  Interactive
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Adjust baseline store parameters to simulate incremental revenue lift from CRO fixes:
              </p>

              {/* Sliders */}
              <div className="space-y-3.5 mt-4 text-xs">
                {/* Traffic Slider */}
                <div>
                  <div className="flex justify-between text-slate-300 font-medium mb-1">
                    <span>Monthly Visitors</span>
                    <span className="font-mono text-blue-400">{traffic.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="500000"
                    step="5000"
                    value={traffic}
                    onChange={(e) => setTraffic(Number(e.target.value))}
                    className="w-full accent-blue-500 bg-[#0B0F17] h-1.5 rounded-lg cursor-pointer"
                  />
                </div>

                {/* AOV Slider */}
                <div>
                  <div className="flex justify-between text-slate-300 font-medium mb-1">
                    <span>Average Order Value (AOV)</span>
                    <span className="font-mono text-blue-400">${aov}</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="300"
                    step="5"
                    value={aov}
                    onChange={(e) => setAov(Number(e.target.value))}
                    className="w-full accent-blue-500 bg-[#0B0F17] h-1.5 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Conversion Rate Slider */}
                <div>
                  <div className="flex justify-between text-slate-300 font-medium mb-1">
                    <span>Current Conversion Rate</span>
                    <span className="font-mono text-slate-400">{currentCr}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="5.0"
                    step="0.1"
                    value={currentCr}
                    onChange={(e) => setCurrentCr(Number(e.target.value))}
                    className="w-full accent-slate-600 bg-[#0B0F17] h-1.5 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Target Lift Slider */}
                <div>
                  <div className="flex justify-between text-slate-300 font-medium mb-1">
                    <span>Target CRO Lift</span>
                    <span className="font-mono text-emerald-400">+{crLift}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="2.5"
                    step="0.05"
                    value={crLift}
                    onChange={(e) => setCrLift(Number(e.target.value))}
                    className="w-full accent-emerald-500 bg-[#0B0F17] h-1.5 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Output Box */}
            <div className="p-4 bg-[#0B0F17] border border-emerald-800/40 rounded-[8px] space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>New Conversion Target:</span>
                <span className="font-mono font-bold text-slate-200">{targetCr}%</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Monthly Revenue Lift:</span>
                <span className="font-mono font-bold text-emerald-400">+${monthlyLift.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="pt-2 border-t border-[#1F2937] flex justify-between items-baseline">
                <span className="text-xs font-semibold text-slate-200">Projected Annual Lift:</span>
                <span className="text-xl font-black font-mono text-emerald-400">+${annualLift.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: WEBSITE HEATMAP VISUALIZER */}
      {activeTab === 'heatmap' && (
        <div className="bg-[#111827] border border-[#1F2937] rounded-[10px] p-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#1F2937]">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500" /> Interactive Website Heatmap Simulation
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Simulated visitor attention & click density overlay on extracted website wireframe.
              </p>
            </div>

            <div className="flex items-center space-x-1.5 bg-[#0B0F17] border border-[#1F2937] p-1 rounded-[8px]">
              {(['clicks', 'attention', 'scroll'] as const).map((layer) => (
                <button
                  key={layer}
                  onClick={() => setHeatmapLayer(layer)}
                  className={`px-3 py-1 rounded-[6px] text-xs font-semibold capitalize transition-all ${
                    heatmapLayer === layer
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {layer} Heatmap
                </button>
              ))}
            </div>
          </div>

          {/* Wireframe Mockup Frame */}
          <div className="relative border border-[#1F2937] rounded-[10px] bg-[#090D16] p-6 max-w-3xl mx-auto overflow-hidden">
            {/* Browser Header */}
            <div className="flex items-center space-x-2 pb-4 mb-4 border-b border-[#1F2937]">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <div className="flex-1 max-w-sm mx-auto bg-[#111827] border border-[#1F2937] px-3 py-1 rounded text-[11px] text-slate-400 font-mono text-center truncate">
                {audit.url}
              </div>
            </div>

            {/* Simulated Heatmap Layer Overlay */}
            {heatmapLayer === 'clicks' && (
              <div className="absolute inset-0 pointer-events-none z-10 opacity-75">
                <div className="absolute top-[28%] left-[45%] w-24 h-24 rounded-full bg-red-500 blur-2xl animate-pulse" />
                <div className="absolute top-[32%] left-[48%] w-12 h-12 rounded-full bg-yellow-400 blur-xl" />
                <div className="absolute top-[65%] left-[20%] w-16 h-16 rounded-full bg-amber-500 blur-2xl" />
              </div>
            )}

            {heatmapLayer === 'attention' && (
              <div className="absolute inset-0 pointer-events-none z-10 opacity-60">
                <div className="absolute top-[20%] left-[10%] w-[80%] h-32 bg-gradient-to-r from-blue-500 via-emerald-400 to-amber-500 blur-3xl" />
              </div>
            )}

            {/* Wireframe Content Elements */}
            <div className="space-y-6 relative z-0">
              {/* Header Nav */}
              <div className="flex items-center justify-between pb-3 border-b border-[#1F2937]">
                <div className="font-bold text-slate-200 text-sm">{audit.company_name}</div>
                <div className="flex space-x-3 text-xs text-slate-400">
                  {audit.extracted_elements.navigation_links.slice(0, 4).map((link, i) => (
                    <span key={i}>{link}</span>
                  ))}
                </div>
              </div>

              {/* Hero Wireframe */}
              <div className="py-8 px-6 bg-[#111827] border border-[#1F2937] rounded-[10px] text-center space-y-4">
                <h2 className="text-xl font-bold text-slate-100 max-w-md mx-auto">
                  {audit.extracted_elements.headlines[0] || 'Transform Your Daily Routine'}
                </h2>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  {audit.analysis.value_proposition}
                </p>
                <div className="pt-2">
                  <button className="px-6 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-[10px] shadow-glow">
                    {audit.extracted_elements.ctas[0] || 'Shop Now'}
                  </button>
                </div>
              </div>

              {/* Social Proof Row */}
              <div className="p-3 bg-[#111827] border border-[#1F2937] rounded-[10px] text-xs text-slate-300 text-center font-mono">
                {audit.extracted_elements.trust_badges.join(' • ')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PAGESPEED & CORE WEB VITALS */}
      {activeTab === 'pagespeed' && (
        <div className="bg-[#111827] border border-[#1F2937] rounded-[10px] p-5 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#1F2937]">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Gauge className="w-4 h-4 text-blue-400" /> PageSpeed & Core Web Vitals Audit
            </h3>
            <span className="text-xs text-slate-400 font-mono">Lighthouse v11.0 Engine</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-[#0B0F17] border border-[#1F2937] rounded-[10px] text-center">
              <div className="text-[10px] text-slate-500 font-semibold uppercase">Performance</div>
              <div className={`text-3xl font-black font-mono mt-1 ${audit.pagespeed.performance_score >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {audit.pagespeed.performance_score}
              </div>
            </div>
            <div className="p-4 bg-[#0B0F17] border border-[#1F2937] rounded-[10px] text-center">
              <div className="text-[10px] text-slate-500 font-semibold uppercase">Accessibility</div>
              <div className="text-3xl font-black font-mono text-emerald-400 mt-1">
                {audit.pagespeed.accessibility_score}
              </div>
            </div>
            <div className="p-4 bg-[#0B0F17] border border-[#1F2937] rounded-[10px] text-center">
              <div className="text-[10px] text-slate-500 font-semibold uppercase">Best Practices</div>
              <div className="text-3xl font-black font-mono text-blue-400 mt-1">
                {audit.pagespeed.best_practices_score}
              </div>
            </div>
            <div className="p-4 bg-[#0B0F17] border border-[#1F2937] rounded-[10px] text-center">
              <div className="text-[10px] text-slate-500 font-semibold uppercase">SEO Score</div>
              <div className="text-3xl font-black font-mono text-emerald-400 mt-1">
                {audit.pagespeed.seo_score}
              </div>
            </div>
          </div>

          {/* Web Vitals Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-3.5 bg-[#0B0F17] border border-[#1F2937] rounded-[8px]">
              <span className="text-xs font-semibold text-slate-300">Largest Contentful Paint (LCP)</span>
              <div className="text-lg font-bold font-mono text-slate-100 mt-1">{audit.pagespeed.lcp_seconds}s</div>
              <p className="text-[10px] text-slate-500 mt-0.5">Target: &lt; 2.5s (Good)</p>
            </div>
            <div className="p-3.5 bg-[#0B0F17] border border-[#1F2937] rounded-[8px]">
              <span className="text-xs font-semibold text-slate-300">Interaction to Next Paint (INP)</span>
              <div className="text-lg font-bold font-mono text-slate-100 mt-1">{audit.pagespeed.inp_ms} ms</div>
              <p className="text-[10px] text-slate-500 mt-0.5">Target: &lt; 200ms (Good)</p>
            </div>
            <div className="p-3.5 bg-[#0B0F17] border border-[#1F2937] rounded-[8px]">
              <span className="text-xs font-semibold text-slate-300">Cumulative Layout Shift (CLS)</span>
              <div className="text-lg font-bold font-mono text-slate-100 mt-1">{audit.pagespeed.cls_score}</div>
              <p className="text-[10px] text-slate-500 mt-0.5">Target: &lt; 0.1 (Good)</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: FRICTION POINTS */}
      {activeTab === 'friction' && (
        <div className="space-y-4">
          {audit.friction_points.map((fp) => (
            <div key={fp.id} className="bg-[#111827] border border-[#1F2937] rounded-[10px] p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                    fp.severity === 'high' ? 'bg-red-950/60 text-red-400 border border-red-800/60' : 'bg-amber-950/60 text-amber-400 border border-amber-800/60'
                  }`}>
                    {fp.severity} Severity
                  </span>
                  <h4 className="text-sm font-bold text-slate-100">{fp.title}</h4>
                </div>
                <span className="text-xs text-slate-400 font-mono">{fp.category}</span>
              </div>

              <p className="text-xs text-slate-300">{fp.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs">
                <div className="p-2.5 bg-[#0B0F17] rounded-[8px] border border-[#1F2937]">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">Revenue Impact</span>
                  <p className="text-red-400 font-mono font-semibold mt-0.5">{fp.impact}</p>
                </div>
                <div className="p-2.5 bg-[#0B0F17] rounded-[8px] border border-[#1F2937]">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">Recommended Fix</span>
                  <p className="text-emerald-400 font-medium mt-0.5">{fp.recommended_fix}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 5: COMPETITORS */}
      {activeTab === 'competitors' && (
        <div className="bg-[#111827] border border-[#1F2937] rounded-[10px] p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-100">Competitor Research Matrix</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#0B0F17] text-slate-400 uppercase text-[10px] font-semibold border-b border-[#1F2937]">
                <tr>
                  <th className="p-3">Competitor</th>
                  <th className="p-3">UX Score</th>
                  <th className="p-3">Load Speed</th>
                  <th className="p-3">Pricing Strategy</th>
                  <th className="p-3">Key Strengths</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F2937]">
                {audit.competitors.map((comp, idx) => (
                  <tr key={idx} className="hover:bg-[#0B0F17]/50">
                    <td className="p-3 font-semibold text-slate-100">{comp.name}</td>
                    <td className="p-3 font-mono text-blue-400 font-bold">{comp.ux_score}/100</td>
                    <td className="p-3 font-mono">{comp.load_speed_seconds}s</td>
                    <td className="p-3">{comp.pricing_model}</td>
                    <td className="p-3 text-slate-400">{comp.strengths.join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: SALES OUTREACH ASSETS */}
      {activeTab === 'sales_assets' && (
        <div className="bg-[#111827] border border-[#1F2937] rounded-[10px] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100">Generated High-Conversion Sales Assets</h3>
            {onOpenOutreach && (
              <button
                onClick={() => onOpenOutreach(audit.id)}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                Open Full Outreach Campaign <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          
          <div className="p-4 bg-[#0B0F17] border border-[#1F2937] rounded-[10px] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200">Cold Email Teardown Subject:</span>
              <button
                onClick={() => handleCopyText(`Quick CRO feedback on ${audit.domain}`, 'subject')}
                className="text-[10px] font-mono text-blue-400 hover:underline flex items-center gap-1"
              >
                {copiedKey === 'subject' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                Copy Subject
              </button>
            </div>
            <div className="p-3 bg-[#111827] rounded-[8px] font-mono text-xs text-slate-200 border border-[#1F2937]">
              Quick CRO feedback on {audit.domain} (Unlocking +${(annualLift / 1000).toFixed(0)}k/yr)
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
