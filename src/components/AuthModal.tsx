import React, { useState } from 'react';
import { User, X, Key, Shield, Check, Copy, Plus, Lock } from 'lucide-react';
import { ApiKeyRecord } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: { email?: string; name?: string; loggedIn: boolean } | null;
  onLogin: (email: string, name: string) => void;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  user,
  onLogin,
  onLogout
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [apiKeys, setApiKeys] = useState<ApiKeyRecord[]>([
    {
      id: 'key-1',
      name: 'Production Threat Feed API',
      keyPrefix: 'bt_live_9f8a2c1...',
      createdAt: '2026-08-15T00:00:00Z',
      rateLimitPerMin: 120,
      usageToday: 342
    }
  ]);
  const [newKeyName, setNewKeyName] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    onLogin(email, name || email.split('@')[0]);
  };

  const handleCreateKey = () => {
    if (!newKeyName.trim()) return;
    const newKey: ApiKeyRecord = {
      id: `key-${Date.now()}`,
      name: newKeyName,
      keyPrefix: `bt_live_${Math.random().toString(36).substring(2, 8)}...`,
      createdAt: new Date().toISOString(),
      rateLimitPerMin: 60,
      usageToday: 0
    };
    setApiKeys([newKey, ...apiKeys]);
    setNewKeyName('');
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md rounded-2xl bg-neutral-950 border border-white/20 shadow-2xl overflow-hidden font-mono text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-4 bg-neutral-900/90 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-white" />
            <span className="font-bold text-white text-sm">
              {user?.loggedIn ? 'Researcher Account & API Keys' : isRegister ? 'Create BLACKTRACE Account' : 'Sign In to BLACKTRACE'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          
          {user?.loggedIn ? (
            /* Logged in User Profile & API Key Management */
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-white font-bold text-sm block">{user.name || user.email}</span>
                  <span className="text-neutral-400 text-[11px]">{user.email}</span>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded bg-white text-black font-extrabold text-[9px] uppercase">
                    PRO RESEARCHER TIER
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
                >
                  Sign Out
                </button>
              </div>

              {/* API Keys Section */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <span className="font-bold text-white uppercase text-[10px] tracking-wider block">
                  Active API Access Tokens
                </span>

                <div className="space-y-2">
                  {apiKeys.map((k) => (
                    <div key={k.id} className="p-2.5 rounded-lg bg-neutral-900 border border-white/5 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-white font-bold block">{k.name}</span>
                        <code className="text-neutral-400 text-[10px]">{k.keyPrefix}</code>
                      </div>
                      <button
                        onClick={() => copyKey(k.keyPrefix)}
                        className="p-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
                      >
                        {copiedKey === k.keyPrefix ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  ))}
                </div>

                {/* Generate New Key */}
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="New token name (e.g. SIEM Ingestion)..."
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-neutral-900 border border-white/10 text-white placeholder:text-neutral-500 focus:outline-none focus:border-white/30"
                  />
                  <button
                    onClick={handleCreateKey}
                    disabled={!newKeyName.trim()}
                    className="px-3 py-1.5 rounded-lg bg-white text-black font-bold uppercase disabled:opacity-40 hover:bg-neutral-200 transition-colors"
                  >
                    Generate
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Auth Form */
            <form onSubmit={handleSubmit} className="space-y-3">
              {isRegister && (
                <div>
                  <label className="block text-neutral-400 mb-1">Full Name / Handle</label>
                  <input
                    type="text"
                    required
                    placeholder="SecResearcher"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/30"
                  />
                </div>
              )}

              <div>
                <label className="block text-neutral-400 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="analyst@security.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/30"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-white text-black font-bold uppercase tracking-wider hover:bg-neutral-200 transition-colors shadow-lg"
              >
                {isRegister ? 'Create Account' : 'Authenticate'}
              </button>

              {/* Google OAuth Option */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onLogin('researcher@gmail.com', 'Google SecAnalyst')}
                  className="w-full py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-white flex items-center justify-center gap-2 transition-colors font-medium"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#ffffff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#ffffff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#ffffff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#ffffff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </div>

              <div className="pt-2 text-center text-[11px] text-neutral-400">
                {isRegister ? (
                  <span>
                    Already have an account?{' '}
                    <button type="button" onClick={() => setIsRegister(false)} className="text-white underline">
                      Sign In
                    </button>
                  </span>
                ) : (
                  <span>
                    Don't have an account?{' '}
                    <button type="button" onClick={() => setIsRegister(true)} className="text-white underline">
                      Register
                    </button>
                  </span>
                )}
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
