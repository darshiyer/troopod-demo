"use client";
import React from 'react';
import { 
  LayoutDashboard, 
  Search, 
  Users, 
  Send, 
  FileText, 
  Sparkles, 
  Settings, 
  ChevronRight,
  TrendingUp,
  Zap
} from 'lucide-react';

export type NavigationTab = 
  | 'dashboard' 
  | 'audits' 
  | 'crm' 
  | 'outreach' 
  | 'proposals' 
  | 'rewrites' 
  | 'settings';

interface SidebarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  auditCount?: number;
  crmCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  auditCount = 0,
  crmCount = 0
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'audits', label: 'Growth Audits', icon: Search, badge: auditCount > 0 ? auditCount : undefined },
    { id: 'crm', label: 'CRM Pipeline', icon: Users, badge: crmCount > 0 ? crmCount : undefined },
    { id: 'outreach', label: 'Outreach Hub', icon: Send },
    { id: 'proposals', label: 'Proposals & PDF', icon: FileText },
    { id: 'rewrites', label: 'AI Rewrite Lab', icon: Sparkles, highlight: true },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0B0F17] border-r border-[#1F2937] flex flex-col justify-between h-screen sticky top-0 select-none z-30">
      <div>
        {/* Logo & Agency Header */}
        <div className="p-4 border-b border-[#1F2937] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-[10px] bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-glow">
              <Zap className="w-4 h-4 fill-current text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-sm text-slate-100 tracking-tight">Troopod</span>
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">AI</span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium block">Agency Engine v1.0</span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Main Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as NavigationTab)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-[10px] text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm font-semibold'
                    : item.highlight
                    ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#111827]'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-blue-700 text-white' : 'bg-[#1F2937] text-slate-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {item.highlight && !isActive && (
                  <span className="flex h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Agency Status Card */}
      <div className="p-3 m-3 bg-[#111827] border border-[#1F2937] rounded-[10px]">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-slate-400 font-medium flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-blue-400" /> Agency ARR Lift
          </span>
          <span className="text-emerald-400 font-mono font-bold text-[11px]">+24.5%</span>
        </div>
        <div className="w-full bg-[#1F2937] h-1.5 rounded-full overflow-hidden">
          <div className="bg-blue-500 h-full w-[78%] rounded-full" />
        </div>
        <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
          <span>Active Accounts: 12</span>
          <span className="font-mono text-slate-300">Cmd + K</span>
        </div>
      </div>
    </aside>
  );
};
