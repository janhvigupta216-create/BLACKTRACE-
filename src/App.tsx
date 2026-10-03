import React, { useState, useEffect } from 'react';
import { ThreeGlobeBackground } from './components/ThreeGlobeBackground';
import { Navbar } from './components/Navbar';
import { HeroSearch } from './components/HeroSearch';
import { SearchResultsView } from './components/SearchResultsView';
import { AssetDetailPage } from './components/AssetDetailPage';
import { VulnerabilitiesView } from './components/VulnerabilitiesView';
import { TechnologiesView } from './components/TechnologiesView';
import { ServicesView } from './components/ServicesView';
import { AnalyticsView } from './components/AnalyticsView';
import { GlobalMapView } from './components/GlobalMapView';
import { ApiPlaygroundView } from './components/ApiPlaygroundView';
import { DocumentationView } from './components/DocumentationView';
import { AIAssistantModal } from './components/AIAssistantModal';
import { SavedItemsModal } from './components/SavedItemsModal';
import { AuthModal } from './components/AuthModal';
import { AssetIntelligence, SearchQueryResponse, UserSavedItem } from './types';
import { 
  ShieldAlert, 
  Terminal, 
  Globe2, 
  Cpu, 
  AlertTriangle, 
  Search, 
  Lock, 
  ArrowUpRight,
  Shield,
  Layers,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export function App() {
  // Navigation & View State
  const [activeTab, setActiveTab] = useState<string>('search');
  const [selectedAsset, setSelectedAsset] = useState<AssetIntelligence | null>(null);
  
  // Search State
  const [searchResponse, setSearchResponse] = useState<SearchQueryResponse | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [lastQuery, setLastQuery] = useState('');

  // Modals
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiInitialQuestion, setAiInitialQuestion] = useState<string | undefined>(undefined);
  const [savedModalOpen, setSavedModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // User State & Bookmarks
  const [user, setUser] = useState<{ email?: string; name?: string; loggedIn: boolean } | null>({
    email: 'researcher@blacktrace.io',
    name: 'SecAnalyst Alpha',
    loggedIn: true
  });

  const [savedItems, setSavedItems] = useState<UserSavedItem[]>([]);

  // Fetch initial saved items
  useEffect(() => {
    fetch('/api/user/saved')
      .then(res => res.json())
      .then(data => setSavedItems(data || []))
      .catch(() => {});
  }, []);

  // Search Executor
  const handleSearch = async (query: string, filters?: any) => {
    if (!query.trim()) return;
    setIsSearching(true);
    setLastQuery(query);
    setSelectedAsset(null);

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          filters: filters || {},
          limit: 15
        })
      });
      const data: SearchQueryResponse = await res.json();
      setSearchResponse(data);
      setActiveTab('search');
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  // Asset selection
  const handleSelectAsset = (asset: AssetIntelligence) => {
    setSelectedAsset(asset);
  };

  // Load Asset by IP / ID
  const handleSelectAssetById = async (idOrIp: string) => {
    try {
      const res = await fetch(`/api/assets/${idOrIp}`);
      const asset: AssetIntelligence = await res.json();
      setSelectedAsset(asset);
      setActiveTab('intelligence');
    } catch (e) {
      console.error('Failed to load asset:', e);
    }
  };

  // Save/Unsave Asset
  const handleToggleSaveAsset = async (asset: AssetIntelligence) => {
    const existing = savedItems.find(i => i.queryOrId === asset.id || i.queryOrId === asset.ip);
    if (existing) {
      await fetch(`/api/user/saved/${existing.id}`, { method: 'DELETE' });
      setSavedItems(savedItems.filter(i => i.id !== existing.id));
    } else {
      const res = await fetch('/api/user/saved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'asset',
          queryOrId: asset.id,
          title: `${asset.ip} (${asset.hostname || asset.domain})`,
          tags: [asset.severity, asset.asn, ...asset.technologies.map(t => t.name).slice(0, 2)]
        })
      });
      const newItem = await res.json();
      setSavedItems([newItem, ...savedItems]);
    }
  };

  // Save Query
  const handleSaveSearchQuery = async (query: string) => {
    const res = await fetch('/api/user/saved', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'search',
        queryOrId: query,
        title: `Search: ${query}`,
        tags: ['Saved Query']
      })
    });
    const newItem = await res.json();
    setSavedItems([newItem, ...savedItems]);
  };

  const handleDeleteSavedItem = async (id: string) => {
    await fetch(`/api/user/saved/${id}`, { method: 'DELETE' });
    setSavedItems(savedItems.filter(i => i.id !== id));
  };

  const openAIWithQuestion = (question?: string) => {
    setAiInitialQuestion(question);
    setAiModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-neutral-100 flex flex-col relative font-sans selection:bg-white selection:text-black">
      
      {/* 3D WebGL Globe Cyber Network Background */}
      <ThreeGlobeBackground
        isSearching={isSearching}
        isFocused={isSearchFocused}
      />

      {/* Main Glassmorphism Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'intelligence') {
            setSelectedAsset(null);
          }
        }}
        onOpenAI={() => openAIWithQuestion()}
        onOpenSaved={() => setSavedModalOpen(true)}
        onOpenAuth={() => setAuthModalOpen(true)}
        savedCount={savedItems.length}
        user={user}
      />

      {/* Main Content Area */}
      <main className="flex-1 relative z-10">
        
        {/* VIEW 1: SEARCH & ASSET INTELLIGENCE VIEW */}
        {activeTab === 'search' && (
          <div>
            {/* If an asset is currently selected for deep-dive inspection */}
            {selectedAsset ? (
              <AssetDetailPage
                asset={selectedAsset}
                onBack={() => setSelectedAsset(null)}
                onSelectCVE={(cveId) => {
                  setActiveTab('vulnerabilities');
                }}
                onOpenAI={openAIWithQuestion}
                isSaved={savedItems.some(i => i.queryOrId === selectedAsset.id || i.queryOrId === selectedAsset.ip)}
                onToggleSave={() => handleToggleSaveAsset(selectedAsset)}
              />
            ) : searchResponse ? (
              /* Search Results Page */
              <div className="space-y-4">
                <HeroSearch
                  onSearch={handleSearch}
                  isLoading={isSearching}
                  onFocusChange={setIsSearchFocused}
                  initialQuery={lastQuery}
                />
                <SearchResultsView
                  data={searchResponse}
                  onSelectAsset={handleSelectAsset}
                  onSelectCVE={(cveId) => {
                    setActiveTab('vulnerabilities');
                  }}
                  onFilterClick={(key, val) => {
                    handleSearch(`${key}:${val}`);
                  }}
                  onSaveSearch={handleSaveSearchQuery}
                  onSaveAsset={handleToggleSaveAsset}
                  savedAssetIds={savedItems.map(i => i.queryOrId)}
                  onOpenAIForAsset={(asset) => {
                    setSelectedAsset(asset);
                    openAIWithQuestion(`Analyze the threat indicators and open port risks for ${asset.ip}`);
                  }}
                />
              </div>
            ) : (
              /* Initial Homepage Landing View */
              <div className="space-y-12 pb-16">
                <HeroSearch
                  onSearch={handleSearch}
                  isLoading={isSearching}
                  onFocusChange={setIsSearchFocused}
                />

                {/* Homepage Feature Banners / Threat Feeds */}
                <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
                  
                  {/* Card 1: Real-time Asset Discovery */}
                  <div className="p-6 rounded-2xl bg-neutral-950/80 border border-white/10 space-y-3 backdrop-blur-md hover:border-white/25 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center">
                      <Globe2 className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Continuous Asset Fingerprinting
                    </h3>
                    <p className="text-neutral-400 leading-relaxed">
                      Instant indexing of IPv4 and IPv6 perimeters with automated port banners, TLS cryptographic verification, and technology stack inference.
                    </p>
                  </div>

                  {/* Card 2: AI-Assisted Threat Analysis */}
                  <div className="p-6 rounded-2xl bg-neutral-950/80 border border-white/10 space-y-3 backdrop-blur-md hover:border-white/25 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      GenAI Threat Analysis
                    </h3>
                    <p className="text-neutral-400 leading-relaxed">
                      Server-side Gemini 3.7 Flash engine analyzes complex attack surfaces, prioritizes critical CVEs, and generates tailored SOC defensive playbooks.
                    </p>
                  </div>

                  {/* Card 3: CISA KEV & Exploit Telemetry */}
                  <div className="p-6 rounded-2xl bg-neutral-950/80 border border-white/10 space-y-3 backdrop-blur-md hover:border-white/25 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Exploit & Vulnerability Feeds
                    </h3>
                    <p className="text-neutral-400 leading-relaxed">
                      Cross-correlated EPSS scores, weaponized exploit indicators, and CISA Known Exploited Vulnerability notifications on exposed perimeter services.
                    </p>
                  </div>

                </section>
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: INTELLIGENCE / ASSETS */}
        {(activeTab === 'intelligence' || activeTab === 'assets') && (
          <div>
            {selectedAsset ? (
              <AssetDetailPage
                asset={selectedAsset}
                onBack={() => setSelectedAsset(null)}
                onSelectCVE={() => setActiveTab('vulnerabilities')}
                onOpenAI={openAIWithQuestion}
                isSaved={savedItems.some(i => i.queryOrId === selectedAsset.id || i.queryOrId === selectedAsset.ip)}
                onToggleSave={() => handleToggleSaveAsset(selectedAsset)}
              />
            ) : (
              <div className="space-y-4">
                <HeroSearch
                  onSearch={handleSearch}
                  isLoading={isSearching}
                  initialQuery="198.51.100.45"
                />
                {searchResponse && (
                  <SearchResultsView
                    data={searchResponse}
                    onSelectAsset={handleSelectAsset}
                    onSelectCVE={() => setActiveTab('vulnerabilities')}
                    onSaveSearch={handleSaveSearchQuery}
                    onSaveAsset={handleToggleSaveAsset}
                    savedAssetIds={savedItems.map(i => i.queryOrId)}
                  />
                )}
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: VULNERABILITIES */}
        {activeTab === 'vulnerabilities' && (
          <VulnerabilitiesView
            onSelectCVE={(cveId) => handleSearch(cveId)}
            onSearchAssetWithCVE={(cveId) => handleSearch(cveId)}
            onOpenAI={openAIWithQuestion}
          />
        )}

        {/* VIEW 4: TECHNOLOGIES */}
        {activeTab === 'technologies' && (
          <TechnologiesView
            onSearchTech={(tech) => handleSearch(tech)}
          />
        )}

        {/* VIEW 5: SERVICES / PORTS */}
        {activeTab === 'services' && (
          <ServicesView
            onSearchPort={(port) => handleSearch(`port:${port}`)}
          />
        )}

        {/* VIEW 6: ANALYTICS DASHBOARD */}
        {activeTab === 'analytics' && (
          <AnalyticsView
            onExecuteSearch={(query) => handleSearch(query)}
          />
        )}

        {/* VIEW 7: GLOBAL MAP */}
        {activeTab === 'maps' && (
          <GlobalMapView
            onSelectCountry={(countryCode) => handleSearch(`country:${countryCode}`)}
            onSelectAsset={handleSelectAssetById}
          />
        )}

        {/* VIEW 8: API PLAYGROUND */}
        {activeTab === 'api' && (
          <ApiPlaygroundView />
        )}

        {/* VIEW 9: DOCUMENTATION */}
        {activeTab === 'documentation' && (
          <DocumentationView />
        )}

      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-[#080808]/90 backdrop-blur-xl py-8 font-mono text-xs text-neutral-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-white text-black flex items-center justify-center font-bold text-xs">
              B
            </div>
            <span className="font-heading font-bold text-white tracking-wider">BLACKTRACE</span>
            <span className="text-neutral-400">• Search. Discover. Understand the Internet.</span>
          </div>

          <div className="flex items-center gap-4 text-neutral-400">
            <button onClick={() => setActiveTab('documentation')} className="hover:text-white transition-colors">
              Documentation
            </button>
            <button onClick={() => setActiveTab('api')} className="hover:text-white transition-colors">
              API Reference
            </button>
            <button onClick={() => setActiveTab('analytics')} className="hover:text-white transition-colors">
              Telemetry
            </button>
            <span className="text-neutral-400">© 2026 BLACKTRACE Intelligence</span>
          </div>
        </div>
      </footer>

      {/* AI Assistant Modal */}
      <AIAssistantModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        currentAsset={selectedAsset}
        initialQuestion={aiInitialQuestion}
      />

      {/* Saved Items Modal */}
      <SavedItemsModal
        isOpen={savedModalOpen}
        onClose={() => setSavedModalOpen(false)}
        savedItems={savedItems}
        onDeleteItem={handleDeleteSavedItem}
        onExecuteSearch={handleSearch}
        onSelectAsset={handleSelectAssetById}
      />

      {/* User & Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        user={user}
        onLogin={(email, name) => {
          setUser({ email, name, loggedIn: true });
          setAuthModalOpen(false);
        }}
        onLogout={() => {
          setUser(null);
          setAuthModalOpen(false);
        }}
      />

    </div>
  );
}

export default App;
