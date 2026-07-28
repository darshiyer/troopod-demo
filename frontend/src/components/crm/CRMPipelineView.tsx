"use client";
import React, { useState } from 'react';
import { Users, Plus, Search, Filter, Download, ExternalLink, Calendar, Mail, Tag, Trash2, Edit2 } from 'lucide-react';
import { CRMLead, updateCRMLead, getCSVExportUrl } from '../../lib/api';

interface CRMPipelineViewProps {
  leads: CRMLead[];
  onRefreshLeads: () => void;
  onSelectAudit?: (auditId: string) => void;
}

export const CRMPipelineView: React.FC<CRMPipelineViewProps> = ({
  leads,
  onRefreshLeads,
  onSelectAudit
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [editingLeadId, setEditingLeadId] = useState<string | null>(null);

  const statuses = ['All', 'New', 'Contacted', 'Demo Scheduled', 'Proposal Sent', 'Closed Won', 'Closed Lost'];

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.domain.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || lead.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    try {
      await updateCRMLead(leadId, { status: newStatus as any });
      onRefreshLeads();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#111827] border border-[#1F2937] p-5 rounded-[10px]">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-500" /> Agency CRM Lead Pipeline
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage audited e-commerce target accounts, follow-up dates, owners, and pipeline stages.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <a
            href={getCSVExportUrl()}
            download="GrowthPilot_CRM_Leads.csv"
            className="px-3.5 py-2 bg-[#0B0F17] hover:bg-[#1F2937] border border-[#1F2937] text-slate-300 font-medium text-xs rounded-[10px] flex items-center space-x-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export Pipeline</span>
          </a>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#111827] border border-[#1F2937] p-3 rounded-[10px]">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Filter leads by company name or domain..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-[#0B0F17] border border-[#1F2937] rounded-[8px] text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center space-x-1 overflow-x-auto w-full sm:w-auto">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1 rounded-[6px] text-xs font-medium whitespace-nowrap transition-all ${
                selectedStatus === status
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#0B0F17]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* CRM Leads Table */}
      <div className="bg-[#111827] border border-[#1F2937] rounded-[10px] overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0B0F17] text-slate-400 uppercase text-[10px] font-semibold border-b border-[#1F2937]">
              <tr>
                <th className="p-3.5">Company Account</th>
                <th className="p-3.5">Pipeline Stage</th>
                <th className="p-3.5">Contact Details</th>
                <th className="p-3.5">Est. ARR Lift</th>
                <th className="p-3.5">Account Owner</th>
                <th className="p-3.5">Follow-Up Date</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F2937]">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-slate-500 italic">
                    No leads found matching current filter.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-[#0B0F17]/50 transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-[8px] bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                          {lead.company_name[0]}
                        </div>
                        <div>
                          <div className="font-bold text-slate-100">{lead.company_name}</div>
                          <a
                            href={lead.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] text-slate-400 font-mono flex items-center gap-1 hover:text-blue-400"
                          >
                            {lead.domain} <ExternalLink className="w-3 h-3 text-slate-500" />
                          </a>
                        </div>
                      </div>
                    </td>

                    {/* Status Dropdown */}
                    <td className="p-3.5">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        className={`bg-[#0B0F17] border border-[#1F2937] text-xs font-semibold px-2.5 py-1 rounded-[6px] focus:outline-none cursor-pointer ${
                          lead.status === 'Closed Won'
                            ? 'text-emerald-400 border-emerald-800/40'
                            : lead.status === 'Proposal Sent'
                            ? 'text-blue-400 border-blue-800/40'
                            : lead.status === 'Contacted'
                            ? 'text-indigo-400'
                            : 'text-slate-300'
                        }`}
                      >
                        <option value="New">New Lead</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Demo Scheduled">Demo Scheduled</option>
                        <option value="Proposal Sent">Proposal Sent</option>
                        <option value="Closed Won">Closed Won</option>
                        <option value="Closed Lost">Closed Lost</option>
                      </select>
                    </td>

                    <td className="p-3.5">
                      <div className="text-slate-200 font-medium">{lead.contact_name || 'Growth Lead'}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{lead.contact_email || 'No email set'}</div>
                    </td>

                    <td className="p-3.5 font-mono font-bold text-emerald-400">
                      +${(lead.estimated_arr_lift / 1000).toFixed(0)}k/yr
                    </td>

                    <td className="p-3.5 text-slate-300 font-medium">{lead.owner}</td>

                    <td className="p-3.5 font-mono text-slate-400">
                      {lead.follow_up_date || 'Not Scheduled'}
                    </td>

                    <td className="p-3.5 text-right">
                      {lead.audit_id && onSelectAudit && (
                        <button
                          onClick={() => onSelectAudit(lead.audit_id!)}
                          className="px-2.5 py-1 rounded bg-[#0B0F17] hover:bg-[#1F2937] text-[11px] font-semibold text-blue-400 border border-[#1F2937]"
                        >
                          View Audit
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
