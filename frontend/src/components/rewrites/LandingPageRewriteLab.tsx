"use client";
import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Copy, Check, ArrowRight, HelpCircle, Layers, Tag, DollarSign, Shield } from 'lucide-react';
import { LandingPageRewrite, generateLandingPageRewrite, AuditResult } from '../../lib/api';

interface LandingPageRewriteLabProps {
  audits: AuditResult[];
  selectedAuditId?: string;
}

export const LandingPageRewriteLab: React.FC<LandingPageRewriteLabProps> = ({ audits, selectedAuditId }) => {
  const [activeAuditId, setActiveAuditId] = useState<string>(selectedAuditId || (audits[0]?.id || ''));
  const [rewriteData, setRewriteData] = useState<LandingPageRewrite | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  useEffect(() => {
    if (activeAuditId) {
      setIsLoading(true);
      generateLandingPageRewrite(activeAuditId)
        .then((data) => {
          setRewriteData(data);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }, [activeAuditId]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(key);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#111827] border border-[#1F2937] p-5 rounded-[10px]">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" /> AI Landing Page Rewrite Studio (Bonus Suite)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Automatically rewrite headlines, high-converting CTAs, pricing structures, FAQs, hero sections, and SEO meta tags.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-medium">Audited Store:</span>
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

      {isLoading ? (
        <div className="p-16 text-center text-slate-400 text-xs flex flex-col items-center justify-center space-y-3 bg-[#111827] border border-[#1F2937] rounded-[10px]">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
          <span>Generating AI Landing Page Copy & Layout Suite...</span>
        </div>
      ) : rewriteData ? (
        <div className="space-y-6">
          {/* SECTION 1: HEADLINES REWRITE */}
          <div className="bg-[#111827] border border-[#1F2937] rounded-[10px] p-5 space-y-4 shadow-card">
            <div className="flex items-center justify-between pb-3 border-b border-[#1F2937]">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" /> AI Rewritten Headlines & Value Propositions
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                +18.4% Predicted Lift
              </span>
            </div>

            <div className="space-y-4">
              {rewriteData.headlines.map((hl, idx) => (
                <div key={idx} className="p-4 bg-[#0B0F17] border border-[#1F2937] rounded-[10px] space-y-3">
                  <div className="text-xs text-slate-400 flex items-center justify-between">
                    <span>Original Control Headline: <span className="text-slate-200 line-through font-mono">"{hl.original}"</span></span>
                    <span className="text-emerald-400 font-mono font-bold text-[11px]">{hl.predicted_conversion_lift}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[hl.variation_1, hl.variation_2, hl.variation_3].map((varText, vIdx) => (
                      <div key={vIdx} className="p-3 bg-[#111827] border border-[#1F2937] rounded-[8px] flex flex-col justify-between space-y-2 group hover:border-blue-500/50 transition-colors">
                        <div>
                          <span className="text-[10px] text-blue-400 font-mono font-semibold">Option {vIdx + 1}</span>
                          <p className="text-xs font-semibold text-slate-100 mt-1">{varText}</p>
                        </div>
                        <button
                          onClick={() => handleCopy(varText, `hl-${idx}-${vIdx}`)}
                          className="text-[10px] font-mono text-slate-400 hover:text-white flex items-center gap-1 self-start pt-1"
                        >
                          {copiedIndex === `hl-${idx}-${vIdx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          Copy Headline
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-400 italic">Rationale: {hl.rationale}</p>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 2: HIGH-CONVERTING CTAS & FRICTION REDUCERS */}
          <div className="bg-[#111827] border border-[#1F2937] rounded-[10px] p-5 space-y-4 shadow-card">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-emerald-400" /> Optimized CTA Buttons & Subtext Microcopy
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {rewriteData.ctas.map((cta, idx) => (
                <div key={idx} className="p-4 bg-[#0B0F17] border border-[#1F2937] rounded-[10px] space-y-3">
                  <div className="text-xs text-slate-400">
                    Original CTA: <span className="text-slate-300 font-mono">"{cta.original}"</span>
                  </div>
                  <div className="p-3 bg-blue-600/10 border border-blue-500/30 rounded-[8px] text-center space-y-1">
                    <div className="font-bold text-sm text-blue-400">{cta.improved_cta}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{cta.subtext_friction_reducer}</div>
                  </div>
                  <p className="text-[11px] text-slate-400">{cta.placement_recommendation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 3: HERO REDESIGN BRIEF */}
          <div className="bg-[#111827] border border-[#1F2937] rounded-[10px] p-5 space-y-3 shadow-card">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" /> Hero Section Redesign Blueprint
            </h3>
            <div className="p-4 bg-[#0B0F17] border border-[#1F2937] rounded-[10px] space-y-2 text-xs">
              <div className="text-slate-400">Hero Headline: <span className="text-slate-100 font-bold">{rewriteData.hero_redesign.headline}</span></div>
              <div className="text-slate-400">Subheadline: <span className="text-slate-200">{rewriteData.hero_redesign.subheadline}</span></div>
              <div className="text-slate-400">Primary CTA: <span className="text-blue-400 font-semibold">{rewriteData.hero_redesign.primary_cta}</span></div>
              <div className="text-slate-400">Social Proof Bar: <span className="text-amber-400 font-mono">{rewriteData.hero_redesign.social_proof_bar}</span></div>
            </div>
          </div>

          {/* SECTION 4: PRICING & FAQ GENERATOR */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Pricing */}
            <div className="bg-[#111827] border border-[#1F2937] rounded-[10px] p-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-400" /> Pricing & Offer Suggestions
              </h4>
              {rewriteData.pricing_suggestions.map((p, idx) => (
                <div key={idx} className="p-3 bg-[#0B0F17] rounded-[8px] border border-[#1F2937] text-xs space-y-1">
                  <div className="font-bold text-slate-200">{p.tier_name}</div>
                  <p className="text-slate-400 text-[11px]">{p.suggested_structure}</p>
                  <div className="text-[10px] text-emerald-400 font-mono">{p.value_anchoring_tip}</div>
                </div>
              ))}
            </div>

            {/* FAQ */}
            <div className="bg-[#111827] border border-[#1F2937] rounded-[10px] p-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-amber-400" /> Generated High-Intent FAQ
              </h4>
              {rewriteData.faq_section.map((faq, idx) => (
                <div key={idx} className="p-3 bg-[#0B0F17] rounded-[8px] border border-[#1F2937] text-xs space-y-1">
                  <div className="font-bold text-slate-200">Q: {faq.question}</div>
                  <p className="text-slate-400 text-[11px]">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
