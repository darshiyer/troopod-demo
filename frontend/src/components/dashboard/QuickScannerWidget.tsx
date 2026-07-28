"use client";
import React, { useState } from 'react';
import { Search, Loader2, ArrowRight, CheckCircle2, Globe, Shield, Sparkles, AlertCircle } from 'lucide-react';
import { AuditResult, startAuditScan } from '../../lib/api';

interface QuickScannerWidgetProps {
  onScanComplete: (audit: AuditResult) => void;
}

export const QuickScannerWidget: React.FC<QuickScannerWidgetProps> = ({ onScanComplete }) => {
  const [urlInput, setUrlInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const scanSteps = [
    { title: 'Scraping website HTML, OG tags & schema...', icon: Globe },
    { title: 'Evaluating visual hierarchy & CTA contrast...', icon: Shield },
    { title: 'Calculating Lighthouse Core Web Vitals...', icon: Sparkles },
    { title: 'Diagnosing CRO friction points & revenue leakage...', icon: Search },
    { title: 'Benchmarking top 3 competitors...', icon: CheckCircle2 },
    { title: 'Synthesizing editable sales assets & PDF report...', icon: CheckCircle2 }
  ];

  const handleScanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setIsScanning(true);
    setErrorMessage('');
    setCurrentStepIndex(0);

    // Simulate real-time step streaming
    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < scanSteps.length - 1) return prev + 1;
        clearInterval(stepInterval);
        return prev;
      });
    }, 900);

    try {
      const result = await startAuditScan(urlInput.trim());
      clearInterval(stepInterval);
      setCurrentStepIndex(scanSteps.length - 1);
      setTimeout(() => {
        setIsScanning(false);
        onScanComplete(result);
      }, 500);
    } catch (err: any) {
      clearInterval(stepInterval);
      setIsScanning(false);
      setErrorMessage(err.message || 'Failed to scan website. Please try again.');
    }
  };

  return (
    <div className="bg-[#111827] border border-[#1F2937] rounded-[10px] p-6 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Search className="w-4 h-4 text-blue-500" />
            Instant AI Growth Audit & Sales Asset Generator
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Paste any e-commerce URL to audit CRO, page speed, visual UX, and create editable sales assets.
          </p>
        </div>
        <div className="hidden sm:flex items-center space-x-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded-full">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> System Online
        </div>
      </div>

      {/* URL Input Form */}
      <form onSubmit={handleScanSubmit} className="space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Globe className="w-4 h-4 text-slate-500" />
            </div>
            <input
              type="text"
              disabled={isScanning}
              placeholder="https://company.com or gymshark.com"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#0B0F17] border border-[#1F2937] rounded-[10px] text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors font-mono disabled:opacity-60"
            />
          </div>
          <button
            type="submit"
            disabled={isScanning || !urlInput.trim()}
            className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-semibold text-xs rounded-[10px] flex items-center justify-center space-x-2 transition-all shadow-glow"
          >
            {isScanning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Auditing Store...</span>
              </>
            ) : (
              <>
                <span>Run Growth Audit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

        {/* Quick Example URLs */}
        <div className="flex items-center space-x-2 text-[11px] text-slate-400">
          <span>Try sample brands:</span>
          {['allbirds.com', 'gymshark.com', 'ridge.com'].map((domain) => (
            <button
              key={domain}
              type="button"
              disabled={isScanning}
              onClick={() => {
                setUrlInput(`https://${domain}`);
              }}
              className="font-mono underline hover:text-slate-200 transition-colors"
            >
              {domain}
            </button>
          ))}
        </div>
      </form>

      {/* Error Banner */}
      {errorMessage && (
        <div className="mt-4 p-3 bg-red-950/40 border border-red-800/40 rounded-[10px] text-xs text-red-300 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Real-time Progress Streaming Bar */}
      {isScanning && (
        <div className="mt-5 p-4 bg-[#0B0F17] border border-[#1F2937] rounded-[10px] space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
            <span className="flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
              {scanSteps[currentStepIndex].title}
            </span>
            <span className="font-mono text-blue-400">
              {Math.round(((currentStepIndex + 1) / scanSteps.length) * 100)}%
            </span>
          </div>

          {/* Progress bar fill */}
          <div className="w-full bg-[#1F2937] h-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${((currentStepIndex + 1) / scanSteps.length) * 100}%` }}
            />
          </div>

          {/* Steps checklist */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
            {scanSteps.map((step, idx) => {
              const isDone = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              return (
                <div
                  key={idx}
                  className={`flex items-center space-x-1.5 text-[11px] ${
                    isDone
                      ? 'text-emerald-400 font-medium'
                      : isCurrent
                      ? 'text-blue-400 font-semibold'
                      : 'text-slate-600'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  ) : isCurrent ? (
                    <Loader2 className="w-3 h-3 animate-spin text-blue-400 shrink-0" />
                  ) : (
                    <div className="w-3 h-3 rounded-full border border-slate-700 shrink-0" />
                  )}
                  <span className="truncate">{step.title.split(' ')[0]} {step.title.split(' ')[1]}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
