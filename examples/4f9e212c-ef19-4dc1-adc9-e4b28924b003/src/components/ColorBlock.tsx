import React from 'react';
import { Lock, Unlock, Copy, Check } from 'lucide-react';
import { Color } from '../types';

interface ColorBlockProps {
  color: Color;
  onLockToggle: () => void;
}

export const ColorBlock: React.FC<ColorBlockProps> = ({ color, onLockToggle }) => {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="group relative flex flex-col items-center justify-center w-full h-72 rounded-2xl transition-all duration-500 shadow-lg hover:shadow-2xl transform hover:scale-105 overflow-hidden"
      style={{ backgroundColor: color.hex }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="absolute top-4 right-4 flex gap-3">
        <button
          onClick={onLockToggle}
          className="p-3 rounded-xl bg-white/90 hover:bg-white shadow-lg backdrop-blur-sm transition-all duration-300 transform hover:scale-110"
          title={color.locked ? '解锁颜色' : '锁定颜色'}
        >
          {color.locked ? 
            <Lock className="w-5 h-5 text-gray-700" /> : 
            <Unlock className="w-5 h-5 text-gray-700" />
          }
        </button>
        <button
          onClick={() => copyToClipboard(color.hex)}
          className="p-3 rounded-xl bg-white/90 hover:bg-white shadow-lg backdrop-blur-sm transition-all duration-300 transform hover:scale-110"
          title={copied ? '已复制' : '复制颜色代码'}
        >
          {copied ? 
            <Check className="w-5 h-5 text-green-600" /> : 
            <Copy className="w-5 h-5 text-gray-700" />
          }
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
        <p className="text-white font-mono text-xl mb-2 drop-shadow-lg">{color.hex}</p>
        <p className="text-white/80 font-mono text-sm drop-shadow-lg">{color.rgb}</p>
      </div>
    </div>
  );
};