import React, { useState } from 'react';
import {
  Bell,
  BookOpen,
  Building2,
  CheckCircle2,
  ChevronRight,
  Database,
  FileCheck,
  FileSpreadsheet,
  FileText,
  HelpCircle,
  Layers,
  Menu,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Ship,
  UploadCloud,
  X,
} from 'lucide-react';

interface ApplicationLayoutProps {
  children: React.ReactNode;
  currentTab: string;
  onTabChange: (tab: string) => void;
  onCreateNew: () => void;
  shippingBillsCount: number;
}

export const ApplicationLayout: React.FC<ApplicationLayoutProps> = ({
  children,
  currentTab,
  onTabChange,
  onCreateNew,
  shippingBillsCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard & Overview', icon: FileSpreadsheet },
    { id: 'shipping-bills', label: 'Shipping Bills Registry', icon: Ship, count: shippingBillsCount },
    { id: 'esanchit', label: 'e-SANCHIT Doc Locker', icon: UploadCloud },
    { id: 'tariff', label: 'ITC-HS Tariff & Schemes', icon: BookOpen },
    { id: 'icegate', label: 'ICEGATE EDI 1.5 Utility', icon: ShieldCheck },
    { id: 'master', label: 'Exporters & Master Data', icon: Building2 },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-slate-900 text-white sticky top-0 z-40 border-b border-slate-800 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div
                onClick={() => onTabChange('dashboard')}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-md group-hover:bg-blue-500 transition-colors">
                  <Ship className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-base tracking-tight text-white">
                      EXPORT-SOFTWARE
                    </span>
                    <span className="text-[10px] uppercase font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 px-1.5 py-0.5 rounded">
                      ICEGATE 1.5
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-none mt-0.5">
                    Customs Shipping Bill & e-SANCHIT System
                  </p>
                </div>
              </div>
            </div>

            {/* Central Live Customs Indicators */}
            <div className="hidden md:flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-slate-300 font-medium">Gateway:</span>
                <span className="text-emerald-400 font-semibold">ICEGATE Online</span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                <span className="text-slate-400">Customs Forex:</span>
                <span className="font-mono text-slate-200 font-medium">USD ₹83.80</span>
                <span className="text-slate-500">|</span>
                <span className="font-mono text-slate-200 font-medium">EUR ₹91.20</span>
              </div>
            </div>

            {/* Action buttons & User profile */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onCreateNew}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Shipping Bill
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg relative transition-colors"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full"></span>
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200 p-4 z-50 text-xs">
                    <div className="flex items-center justify-between border-b pb-2 mb-2">
                      <span className="font-semibold text-sm">System Alerts & LEO</span>
                      <span className="text-[10px] text-blue-600 font-bold uppercase">2 Updates</span>
                    </div>
                    <div className="space-y-2.5">
                      <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-100">
                        <span className="font-bold text-emerald-800 block">LEO Granted: SB 7829104</span>
                        <span className="text-slate-600 text-[11px]">
                          Container MEDU8291045 cleared at Nhava Sheva Docks.
                        </span>
                      </div>
                      <div className="p-2 bg-blue-50 rounded-lg border border-blue-100">
                        <span className="font-bold text-blue-800 block">e-SANCHIT Token Verified</span>
                        <span className="text-slate-600 text-[11px]">
                          Digital signature token validated for Apex Textiles.
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* User avatar */}
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-700 to-indigo-500 flex items-center justify-center font-bold text-white text-xs">
                  EXP
                </div>
                <div className="hidden xl:block text-left">
                  <div className="text-xs font-semibold text-white">Customs Broker</div>
                  <div className="text-[10px] text-slate-400">CHA Lic: 11/0492</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container with Sidebar */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-3 sticky top-24 space-y-1">
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Operations
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive ? 'bg-blue-800 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}

            <div className="pt-4 mt-4 border-t border-slate-200 px-3">
              <div className="p-3 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl text-xs space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-amber-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Customs Compliance</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  All shipping bills automatically conform with Indian Customs Section 50 & e-SANCHIT mandates.
                </p>
                <div className="text-[10px] text-slate-400 font-mono">
                  Schema: RES 1.5.82 / ICES
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative bg-white w-72 max-w-[80vw] h-full shadow-2xl p-4 flex flex-col z-10">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
                <span className="font-bold text-slate-900">Navigation</span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-slate-500 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onTabChange(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium ${
                        isActive
                          ? 'bg-blue-600 text-white font-semibold'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.count !== undefined && (
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-4 text-xs text-slate-500">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span>Export Software — Indian Customs Shipping Bill Filing System</span>
            <span className="text-slate-300">•</span>
            <span className="text-emerald-700 font-medium">100% Error-Free Validated</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>ICEGATE v1.5 EDI Ready</span>
            <span>e-SANCHIT Single Window</span>
            <span>Central Board of Indirect Taxes & Customs</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
