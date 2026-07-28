"use client";
import React, { useState } from 'react';
import { Send, Copy, Check, Sparkles, Mail, Linkedin, Twitter, FileText, ChevronRight, RefreshCw } from 'lucide-react';
import { OutreachCampaign, generateOutreachCampaign, AuditResult } from '../../lib/api';

interface OutreachHubViewProps {
  audits: AuditResult[];
  selectedAuditId?: string;
}

export const OutreachHubView: React.FC<OutreachHubViewProps> = ({ audits, selectedAuditId }) => {
  const [activeAuditId, setActiveAuditId] = useState<string>(selectedAuditId || (audits[0]?.id || ''));
  const [activeChannel, setActiveChannel] = useState<'cold_email' | 'linkedin' | 'twitter' | 'followup' | 'founder' | 'proposal'>('cold_email');
  
  const [campaign, setCampaign] = useState<OutreachCampaign | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedChannel, setCopiedChannel] = useState<string | null>(null);

  // Load campaign on audit change
  React.useEffect(() => {
    if (activeAuditId) {
      setIsLoading(true);
      generateOutreachCampaign(activeAuditId)
        .then((data) => {
          setCampaign(data);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }, [activeAuditId]);

  const handleCopy = (text: string, channelKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedChannel(channelKey);
    setTimeout(() => setCopiedChannel(null), 2000);
  };

  const getAssetByChannel = () => {
    if (!campaign) return null;
    switch (activeChannel) {
      case 'cold_email': return campaign.cold_email;
      case 'linkedin': return campaign.linkedin_message;
      case 'twitter': return campaign.twitter_dm;
      case 'followup': return campaign.follow_up_email;
      case 'founder': return campaign.founder_intro;
      case 'proposal': return campaign.sales_proposal;
      default: return campaign.cold_email;
    }
  };

  const currentAsset = getAssetByChannel();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#111827] border border-[#1F2937] p-5 rounded-[10px]">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Send className="w-4 h-4 text-blue-500" /> Multi-Channel Outreach Campaign Studio
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Auto-generate tailored cold emails, LinkedIn InMails, DMs, follow-ups, and sales proposals from audit data.
          </p>
        </div>

        {/* Audit Target Picker */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-medium">Target Account:</span>
          <select
            value={activeAuditId}
            onChange={(e) => setActiveAuditId(e.target.value)}
            className="bg-[#0B0F17] border border-[#1F2937] text-xs font-semibold px-3 py-2 rounded-[8px] text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            {audits.map((a) => (
              <option key={a.id} value={a.id}>
                {a.company_name} ({a.domain})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Campaign Builder */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Channel Tabs */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 block mb-2">
            Outreach Channels
          </span>

          {[
            { id: 'cold_email', label: 'Cold Email Teardown', icon: Mail },
            { id: 'linkedin', label: 'LinkedIn InMail', icon: Linkedin },
            { id: 'twitter', label: 'Twitter / X DM', icon: Twitter },
            { id: 'followup', label: 'Follow-Up Sequence', icon: Mail },
            { id: 'founder', label: 'Founder Intro', icon: Sparkles },
            { id: 'proposal', label: 'Sales Proposal Brief', icon: FileText }
          ].map((ch) => {
            const Icon = ch.icon;
            const isActive = activeChannel === ch.id;
            return (
              <button
                key={ch.id}
                onClick={() => setActiveChannel(ch.id as any)}
                className={`w-full flex items-center justify-between p-3 rounded-[10px] text-xs font-semibold text-left transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-[#111827] border border-[#1F2937] text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{ch.label}</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-600'}`} />
              </button>
            );
          })}
        </div>

        {/* Right 3 Columns: Editable Asset Editor */}
        <div className="lg:col-span-3 bg-[#111827] border border-[#1F2937] rounded-[10px] p-5 space-y-4 shadow-card">
          {isLoading ? (
            <div className="p-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center space-y-2">
              <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />
              <span>Generating sales asset suite...</span>
            </div>
          ) : currentAsset ? (
            <>
              {/* Asset Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#1F2937]">
                <div>
                  <h3 className="text-sm font-bold text-slate-100">{currentAsset.title}</h3>
                  <p className="text-[11px] text-slate-400">
                    Target Role: <span className="text-slate-200 font-medium">{currentAsset.target_role}</span> • Tone: <span className="text-blue-400 font-mono capitalize">{currentAsset.tone}</span>
                  </p>
                </div>

                <button
                  onClick={() => handleCopy(`${currentAsset.subject_line ? `Subject: ${currentAsset.subject_line}\n\n` : ''}${currentAsset.body_content}`, activeChannel)}
                  className="px-3 py-1.5 bg-[#0B0F17] hover:bg-[#1F2937] border border-[#1F2937] text-xs font-semibold text-blue-400 rounded-[8px] flex items-center space-x-1.5 transition-colors"
                >
                  {copiedChannel === activeChannel ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-blue-400" />
                      <span>Copy Copytext</span>
                    </>
                  )}
                </button>
              </div>

              {/* Subject Line (if applicable) */}
              {currentAsset.subject_line && (
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Subject Line</label>
                  <input
                    type="text"
                    defaultValue={currentAsset.subject_line}
                    className="w-full px-3 py-2 bg-[#0B0F17] border border-[#1F2937] rounded-[8px] text-xs font-mono font-semibold text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}

              {/* Editable Body Content */}
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Message Body</label>
                <textarea
                  rows={10}
                  defaultValue={currentAsset.body_content}
                  className="w-full p-3.5 bg-[#0B0F17] border border-[#1F2937] rounded-[8px] text-xs font-mono text-slate-200 leading-relaxed focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 font-mono">
                <span>Variables replaced: {"{FirstName}"}, {"{Domain}"}, {"{ARR_Lift}"}</span>
                <span>Editable rich text</span>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs italic">
              Select an audited account above to view generated outreach copy.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
