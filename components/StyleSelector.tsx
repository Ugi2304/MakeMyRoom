import React from 'react';
import { DESIGN_STYLES, DesignStyle } from '../types';

interface StyleSelectorProps {
  onSelect: (style: DesignStyle) => void;
  selectedStyleId?: string;
  disabled?: boolean;
}

const StyleSelector: React.FC<StyleSelectorProps> = ({ onSelect, selectedStyleId, disabled }) => {
  return (
    <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
      <div className="flex gap-4 min-w-max px-2">
        {DESIGN_STYLES.map((style) => (
          <button
            key={style.id}
            onClick={() => onSelect(style)}
            disabled={disabled}
            className={`
              relative group flex flex-col items-center gap-2 p-2 rounded-xl transition-all duration-300
              ${selectedStyleId === style.id ? 'bg-indigo-600/20 ring-2 ring-indigo-500' : 'hover:bg-slate-800'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div className="relative w-24 h-24 rounded-lg overflow-hidden shadow-md">
              <img 
                src={style.thumbnail} 
                alt={style.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className={`absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors ${selectedStyleId === style.id ? 'bg-transparent' : ''}`} />
            </div>
            <span className={`text-sm font-medium ${selectedStyleId === style.id ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-200'}`}>
              {style.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StyleSelector;