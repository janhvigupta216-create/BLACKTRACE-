import React from 'react';
import { Bookmark, X, Trash2, Search, ArrowUpRight, Shield } from 'lucide-react';
import { UserSavedItem } from '../types';

interface SavedItemsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedItems: UserSavedItem[];
  onDeleteItem: (id: string) => void;
  onExecuteSearch: (query: string) => void;
  onSelectAsset: (assetId: string) => void;
}

export const SavedItemsModal: React.FC<SavedItemsModalProps> = ({
  isOpen,
  onClose,
  savedItems,
  onDeleteItem,
  onExecuteSearch,
  onSelectAsset
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl rounded-2xl bg-neutral-950 border border-white/20 shadow-2xl overflow-hidden font-mono text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-4 bg-neutral-900/90 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-white" />
            <span className="font-bold text-white text-sm">Saved Searches & Monitored Assets</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-3">
          {savedItems.length === 0 ? (
            <div className="p-8 text-center text-neutral-500 space-y-2">
              <Bookmark className="w-8 h-8 mx-auto text-neutral-600" />
              <p>No saved searches or monitored assets yet.</p>
              <p className="text-[11px] text-neutral-600">Click the bookmark icon on any search or asset card to save it here.</p>
            </div>
          ) : (
            savedItems.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-neutral-900/80 border border-white/10 hover:border-white/25 transition-all flex items-center justify-between gap-3 group"
              >
                <div 
                  className="space-y-1 cursor-pointer flex-1"
                  onClick={() => {
                    if (item.type === 'asset') {
                      onSelectAsset(item.queryOrId);
                    } else {
                      onExecuteSearch(item.queryOrId);
                    }
                    onClose();
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-neutral-800 border border-white/10 uppercase text-neutral-300 font-bold">
                      {item.type}
                    </span>
                    <span className="text-white font-bold group-hover:underline">{item.title}</span>
                  </div>
                  {item.notes && <p className="text-neutral-400 text-[11px]">{item.notes}</p>}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      if (item.type === 'asset') {
                        onSelectAsset(item.queryOrId);
                      } else {
                        onExecuteSearch(item.queryOrId);
                      }
                      onClose();
                    }}
                    className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white transition-colors"
                    title="Open"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
