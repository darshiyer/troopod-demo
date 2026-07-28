"use client";
import React, { useState } from 'react';
import { Search, Bell, Moon, Sun, Download, ShieldCheck } from 'lucide-react';
import { getCSVExportUrl } from '../../lib/api';

interface NavbarProps {
  onOpenSearch: () => void;
  activeTabTitle: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch, activeTabTitle }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: 'Audit completed for Allbirds', time: '2m ago', read: false },
    { id: 2, title: 'New CRM Lead created: Gymshark', time: '1h ago', read: false },
    { id: 3, title: 'PDF Sales Report downloaded', time: '3h ago', read: true },
  ];

  return (
    <header className="h-16 bg-[#0B0F17]/90 backdrop-blur border-b border-[#1F2937] px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Title / Breadcrumb */}
      <div className="flex items-center space-x-3">
        <h1 className="text-sm font-semibold text-slate-100 capitalize">{activeTabTitle}</h1>
        <span className="text-xs text-slate-500">•</span>
        <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> Agency Workspace
        </span>
      </div>

      {/* Center Quick Search Trigger */}
      <button
        onClick={onOpenSearch}
        className="w-96 flex items-center justify-between px-3.5 py-1.5 bg-[#111827] border border-[#1F2937] rounded-[10px] text-xs text-slate-400 hover:border-slate-700 transition-all group"
      >
        <div className="flex items-center space-x-2">
          <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200 transition-colors" />
          <span>Search audits, company URLs, or CRM leads...</span>
        </div>
        <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1F2937] text-slate-300 border border-slate-700">
          ⌘K
        </kbd>
      </button>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        {/* CSV Export Button */}
        <a
          href={getCSVExportUrl()}
          download="GrowthPilot_Audits.csv"
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-[10px] bg-[#111827] border border-[#1F2937] text-xs font-medium text-slate-300 hover:text-white hover:border-slate-700 transition-all"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <span>Export CSV</span>
        </a>

        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-[10px] bg-[#111827] border border-[#1F2937] text-slate-400 hover:text-slate-200 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#111827] border border-[#1F2937] rounded-[10px] shadow-lg p-3 text-xs z-50">
              <div className="flex items-center justify-between pb-2 border-b border-[#1F2937] font-semibold text-slate-200">
                <span>Recent Activity</span>
                <span className="text-[10px] text-blue-400">Mark all read</span>
              </div>
              <div className="divide-y divide-[#1F2937] mt-1">
                {notifications.map((n) => (
                  <div key={n.id} className="py-2.5 flex items-start justify-between">
                    <div>
                      <div className="text-slate-200 font-medium">{n.title}</div>
                      <div className="text-[10px] text-slate-400">{n.time}</div>
                    </div>
                    {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1" />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dark/Light Mode Toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 rounded-[10px] bg-[#111827] border border-[#1F2937] text-slate-400 hover:text-slate-200 transition-colors"
          title="Toggle Theme"
        >
          {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>

        {/* User Profile Avatar */}
        <div className="flex items-center space-x-2 pl-2 border-l border-[#1F2937]">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-xs text-white">
            GP
          </div>
          <div className="hidden md:block text-left text-xs">
            <div className="font-semibold text-slate-200 leading-none">Senior Growth Lead</div>
            <div className="text-[10px] text-slate-400 mt-0.5">agency@growthpilot.ai</div>
          </div>
        </div>
      </div>
    </header>
  );
};
