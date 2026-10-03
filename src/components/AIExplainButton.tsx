import React from 'react';
import { Sparkles, HelpCircle } from 'lucide-react';
import { AIExplanationCategory } from '../types';

interface AIExplainButtonProps {
  category: AIExplanationCategory;
  identifier: string;
  itemData?: any;
  onExplain: (category: AIExplanationCategory, identifier: string, itemData?: any) => void;
  variant?: 'badge' | 'icon' | 'button' | 'subtle';
  label?: string;
  className?: string;
}

export const AIExplainButton: React.FC<AIExplainButtonProps> = ({
  category,
  identifier,
  itemData,
  onExplain,
  variant = 'badge',
  label = 'AI Explain',
  className = ''
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onExplain(category, identifier, itemData);
  };

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={handleClick}
        title={`Explain ${identifier} with AI`}
        className={`p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors inline-flex items-center justify-center ${className}`}
      >
        <Sparkles className="w-3.5 h-3.5" />
      </button>
    );
  }

  if (variant === 'subtle') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center gap-1 text-[10px] font-mono text-neutral-400 hover:text-white transition-colors ${className}`}
      >
        <Sparkles className="w-3 h-3 text-neutral-300" />
        <span>{label}</span>
      </button>
    );
  }

  if (variant === 'button') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-900 hover:bg-neutral-800 border border-white/15 text-xs font-mono text-white transition-all shadow-sm ${className}`}
      >
        <Sparkles className="w-3 h-3 text-white" />
        <span>{label}</span>
      </button>
    );
  }

  // Default 'badge'
  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white border border-white/10 transition-all ${className}`}
    >
      <Sparkles className="w-2.5 h-2.5 text-neutral-200" />
      <span>{label}</span>
    </button>
  );
};
