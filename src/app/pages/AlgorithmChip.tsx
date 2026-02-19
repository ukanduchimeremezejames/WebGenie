import { Check } from 'lucide-react';

interface AlgorithmChipProps {
  name: string;
  selected?: boolean;
  onClick?: () => void;
  color?: string;
}

export function AlgorithmChip({ name, selected, onClick, color }: AlgorithmChipProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg border-2 transition-all ${
        selected
          ? 'border-purple-500 bg-purple-50 text-purple-700'
          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
      }`}
    >
      <div className="flex items-center gap-2">
        {color && (
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: color }}
          />
        )}
        <span className="text-sm">{name}</span>
        {selected && <Check className="w-4 h-4" />}
      </div>
    </button>
  );
}
