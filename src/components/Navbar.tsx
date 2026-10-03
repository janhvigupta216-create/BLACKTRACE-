import React, { useState } from 'react';
import { 
  Shield, 
  Search, 
  Layers, 
  AlertTriangle, 
  BarChart3, 
  Globe2, 
  Terminal, 
  BookOpen, 
  Sparkles, 
  Bookmark, 
  User, 
  Menu, 
  X,
  Radio
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAI: () => void;
  onOpenSaved: () => void;
  onOpenAuth: () => void;
  savedCount: number;
  user: { email?: string; name?: string; loggedIn: boolean } | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAI,
  onOpenSaved,
  onOpenAuth,
  savedCount,
  user
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'search', label: 'Search', icon: Search },
    { id: 'intelligence', label: 'Intelligence', icon: Layers },
    { id: 'assets', label: 'Assets', icon: Shield },
    { id: 'vulnerabilities', label: 'Vulnerabilities', icon: AlertTriangle },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'maps', label: 'Maps', icon: Globe2 },
    { id: 'api', label: 'API', icon: Terminal },
    { id: 'documentation', label: 'Documentation', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#080808]/80 border-b border-white/[0.08] transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab('search')}>
          <div className="w-9 h-9 rounded-lg bg-neutral-900 border border-white/20 flex items-center justify-center relative overflow-hidden group-hover:border-white/40 transition-colors">
            <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-colors" />
            <Shield className="w-5 h-5 text-white stroke-[2.2]" />
            <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-white animate-ping opacity-75" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold tracking-widest text-lg text-white">BLACKTRACE</span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-neutral-900 border border-white/10 text-neutral-400 font-semibold">CTI v4</span>
            </div>
            <span className="text-[11px] text-neutral-400 hidden sm:inline tracking-tight">Search. Discover. Understand the Internet.</span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-neutral-950/60 p-1 rounded-xl border border-white/[0.06]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-black' : 'text-neutral-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Icons & Auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Live Global Sensor Status */}
          <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-full bg-neutral-950 border border-white/10 text-[11px] font-mono text-neutral-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>GLOBAL SENSORS ONLINE</span>
          </div>

          {/* AI Security Assistant Button */}
          <button
            id="navbar-ai-assistant-btn"
            onClick={onOpenAI}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-white/15 text-xs font-mono text-neutral-200 hover:text-white transition-all shadow-sm group"
            title="Open AI Security Assistant"
          >
            <Sparkles className="w-3.5 h-3.5 text-white group-hover:rotate-12 transition-transform" />
            <span className="hidden sm:inline">AI Analyst</span>
          </button>

          {/* Bookmarks / Saved Searches */}
          <button
            id="navbar-saved-items-btn"
            onClick={onOpenSaved}
            className="relative p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-neutral-300 hover:text-white transition-colors"
            title="Saved Searches & Monitored Assets"
          >
            <Bookmark className="w-4 h-4" />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white text-black text-[9px] font-bold flex items-center justify-center font-mono">
                {savedCount}
              </span>
            )}
          </button>

          {/* User Profile / Auth Modal */}
          {user?.loggedIn ? (
            <button
              id="navbar-user-profile-btn"
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-mono text-white transition-colors"
            >
              <div className="w-5 h-5 rounded-full bg-white text-black text-[10px] font-bold flex items-center justify-center">
                {user.email?.[0].toUpperCase() || 'U'}
              </div>
              <span className="hidden md:inline truncate max-w-[120px]">{user.name || user.email}</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                id="navbar-login-btn"
                onClick={onOpenAuth}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-300 hover:text-white hover:bg-white/[0.05] transition-colors"
              >
                Login
              </button>
              <button
                id="navbar-signup-btn"
                onClick={onOpenAuth}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white text-black hover:bg-neutral-200 transition-colors shadow-sm"
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-neutral-900 border border-white/10 text-neutral-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#080808] px-4 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive ? 'bg-white text-black font-semibold' : 'text-neutral-300 hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
