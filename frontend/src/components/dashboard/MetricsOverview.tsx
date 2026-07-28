"use client";
import React from 'react';
import { Search, TrendingUp, Users, DollarSign, ArrowUpRight, Zap } from 'lucide-react';
import { AuditResult, CRMLead } from '../../lib/api';

interface MetricsOverviewProps {
  audits: AuditResult[];
  crmLeads: CRMLead[];
}

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({ audits, crmLeads }) => {
  const totalAudits = audits.length;
  
  const totalRevOpp = audits.reduce((acc, a) => acc + (a.revenue_opportunity?.annual_revenue_lift || 0), 0);
  const avgConversionScore = totalAudits > 0 
    ? Math.round(audits.reduce((acc, a) => acc + a.conversion_score, 0) / totalAudits) 
    : 76;

  const activeLeads = crmLeads.filter(l => l.status !== 'Closed Lost').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Metric 1 */}
      <div className="p-4 bg-[#111827] border border-[#1F2937] rounded-[10px] shadow-subtle flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
          <span>Completed Audits</span>
          <div className="p-1.5 rounded-[6px] bg-blue-600/10 text-blue-400 border border-blue-500/20">
            <Search className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-2xl font-black font-mono text-slate-100">{totalAudits}</span>
          <span className="text-[11px] font-mono text-emerald-400 flex items-center">
            +100% <ArrowUpRight className="w-3 h-3 ml-0.5" />
          </span>
        </div>
        <div className="text-[10px] text-slate-500 mt-1">Total e-commerce scans</div>
      </div>

      {/* Metric 2 */}
      <div className="p-4 bg-[#111827] border border-[#1F2937] rounded-[10px] shadow-subtle flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
          <span>ARR Pipeline Opportunity</span>
          <div className="p-1.5 rounded-[6px] bg-emerald-600/10 text-emerald-400 border border-emerald-500/20">
            <DollarSign className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-2xl font-black font-mono text-emerald-400">
            ${(totalRevOpp / 1000).toFixed(0)}k
          </span>
          <span className="text-[11px] font-mono text-emerald-400 flex items-center">
            +18.4% <ArrowUpRight className="w-3 h-3 ml-0.5" />
          </span>
        </div>
        <div className="text-[10px] text-slate-500 mt-1">Identified annual revenue lift</div>
      </div>

      {/* Metric 3 */}
      <div className="p-4 bg-[#111827] border border-[#1F2937] rounded-[10px] shadow-subtle flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
          <span>Avg CRO Benchmark</span>
          <div className="p-1.5 rounded-[6px] bg-indigo-600/10 text-indigo-400 border border-indigo-500/20">
            <Zap className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-2xl font-black font-mono text-indigo-400">{avgConversionScore}/100</span>
          <span className="text-[11px] font-mono text-blue-400">Benchmark</span>
        </div>
        <div className="text-[10px] text-slate-500 mt-1">Average store conversion rating</div>
      </div>

      {/* Metric 4 */}
      <div className="p-4 bg-[#111827] border border-[#1F2937] rounded-[10px] shadow-subtle flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
          <span>Active CRM Leads</span>
          <div className="p-1.5 rounded-[6px] bg-purple-600/10 text-purple-400 border border-purple-500/20">
            <Users className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-2xl font-black font-mono text-purple-400">{activeLeads}</span>
          <span className="text-[11px] font-mono text-slate-400">In Sales Pipeline</span>
        </div>
        <div className="text-[10px] text-slate-500 mt-1">Qualified growth accounts</div>
      </div>
    </div>
  );
};
