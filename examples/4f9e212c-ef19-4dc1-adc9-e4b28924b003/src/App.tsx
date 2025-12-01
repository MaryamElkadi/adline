import React, { useState, useEffect } from 'react';
import { Palette, Save, Sun, Moon } from 'lucide-react';
import { ColorBlock } from './components/ColorBlock';
import { ColorSchemeCard } from './components/ColorSchemeCard';
import { AnimatedBackground } from './components/AnimatedBackground';
import { generateHSLColor, hslToHex, hslToRgb } from './utils/colorUtils';
import { Color, ColorScheme } from './types';

function App() {
  const [colors, setColors] = useState<Color[]>([]);
  const [savedSchemes, setSavedSchemes] = useState<ColorScheme[]>([]);
  const [isWarm, setIsWarm] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    generateNewColors();
    const savedSchemesData = localStorage.getItem('colorSchemes');
    if (savedSchemesData) {
      setSavedSchemes(JSON.parse(savedSchemesData));
    }
  }, []);

  const generateNewColors = () => {
    setColors(prevColors => 
      Array(5).fill(null).map((_, i) => {
        if (prevColors[i]?.locked) return prevColors[i];
        const hsl = generateHSLColor(isWarm);
        return {
          hex: hslToHex(hsl),
          rgb: hslToRgb(hsl),
          hsl,
          locked: false
        };
      })
    );
  };

  const toggleLock = (index: number) => {
    setColors(prevColors => 
      prevColors.map((color, i) => 
        i === index ? { ...color, locked: !color.locked } : color
      )
    );
  };

  const saveScheme = () => {
    const newScheme: ColorScheme = {
      id: Date.now().toString(),
      name: `配色方案 ${savedSchemes.length + 1}`,
      colors: [...colors],
      createdAt: new Date().toISOString(),
      usageCount: 0
    };

    const updatedSchemes = [...savedSchemes, newScheme];
    setSavedSchemes(updatedSchemes);
    localStorage.setItem('colorSchemes', JSON.stringify(updatedSchemes));
  };

  const deleteScheme = (id: string) => {
    const updatedSchemes = savedSchemes.filter(scheme => scheme.id !== id);
    setSavedSchemes(updatedSchemes);
    localStorage.setItem('colorSchemes', JSON.stringify(updatedSchemes));
  };

  const applyScheme = (scheme: ColorScheme) => {
    setColors(scheme.colors);
    const updatedSchemes = savedSchemes.map(s => 
      s.id === scheme.id ? { ...s, usageCount: s.usageCount + 1 } : s
    );
    setSavedSchemes(updatedSchemes);
    localStorage.setItem('colorSchemes', JSON.stringify(updatedSchemes));
  };

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground darkMode={darkMode} />
      
      <div className="relative">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-12">
            <h1 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} tracking-tight`}>
              随机配色生成器
              <span className={`block text-sm font-normal mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                创建、保存和管理你的配色方案
              </span>
            </h1>
            <div className="flex gap-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-3 rounded-xl backdrop-blur-sm ${
                  darkMode 
                    ? 'bg-gray-700/80 text-white hover:bg-gray-600/80' 
                    : 'bg-white/80 text-gray-800 hover:bg-white'
                } shadow-lg transition-all duration-300 transform hover:scale-105`}
                title={darkMode ? '切换到浅色模式' : '切换到深色模式'}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setIsWarm(!isWarm)}
                className={`px-6 py-3 rounded-xl shadow-lg backdrop-blur-sm transition-all duration-300 transform hover:scale-105 ${
                  isWarm 
                    ? 'bg-gradient-to-r from-orange-500/90 to-red-500/90 text-white hover:from-orange-600/90 hover:to-red-600/90' 
                    : 'bg-gradient-to-r from-blue-500/90 to-cyan-500/90 text-white hover:from-blue-600/90 hover:to-cyan-600/90'
                }`}
              >
                {isWarm ? '暖色系' : '冷色系'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-12">
            {colors.map((color, index) => (
              <ColorBlock
                key={index}
                color={color}
                onLockToggle={() => toggleLock(index)}
              />
            ))}
          </div>

          <div className="flex justify-center gap-6 mb-16">
            <button
              onClick={generateNewColors}
              className={`flex items-center gap-3 px-8 py-4 rounded-xl shadow-lg backdrop-blur-sm ${
                darkMode 
                  ? 'bg-blue-500/90 hover:bg-blue-600/90' 
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white transition-all duration-300 transform hover:scale-105`}
            >
              <Palette className="w-5 h-5" />
              生成新配色
            </button>
            <button
              onClick={saveScheme}
              className={`flex items-center gap-3 px-8 py-4 rounded-xl shadow-lg backdrop-blur-sm ${
                darkMode 
                  ? 'bg-green-500/90 hover:bg-green-600/90' 
                  : 'bg-green-500 hover:bg-green-600'
              } text-white transition-all duration-300 transform hover:scale-105`}
            >
              <Save className="w-5 h-5" />
              保存方案
            </button>
          </div>

          <h2 className={`text-2xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            已保存的配色方案
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {savedSchemes.map(scheme => (
              <ColorSchemeCard
                key={scheme.id}
                scheme={scheme}
                onDelete={() => deleteScheme(scheme.id)}
                onApply={() => applyScheme(scheme)}
                darkMode={darkMode}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;