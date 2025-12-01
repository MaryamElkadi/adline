import React from 'react';
import { Trash2, Play } from 'lucide-react';
import { ColorScheme } from '../types';

interface ColorSchemeCardProps {
  scheme: ColorScheme;
  onDelete: () => void;
  onApply: () => void;
  darkMode: boolean;
}

export const ColorSchemeCard: React.FC<ColorSchemeCardProps> = ({
  scheme,
  onDelete,
  onApply,
  darkMode,
}) => {
  return (
    <div className={`${
      darkMode ? 'bg-gray-800' : 'bg-white'
    } rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden`}>
      <div className="flex justify-between items-center p-6">
        <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          {scheme.name}
        </h3>
        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          使用次数：{scheme.usageCount}
        </span>
      </div>

      <div className="flex h-24">
        {scheme.colors.map((color, index) => (
          <div
            key={index}
            className="flex-1 transition-transform duration-300 hover:scale-y-105"
            style={{ backgroundColor: color.hex }}
          />
        ))}
      </div>

      <div className="flex justify-between p-6 gap-4">
        <button
          onClick={onApply}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 text-white rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          <Play className="w-4 h-4" />
          应用
        </button>
        <button
          onClick={onDelete}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
            darkMode 
              ? 'bg-gray-700 text-red-400 hover:bg-gray-600' 
              : 'bg-red-50 text-red-600 hover:bg-red-100'
          }`}
        >
          <Trash2 className="w-4 h-4" />
          删除
        </button>
      </div>
    </div>
  );
};